import { useState, useEffect } from "react";
import { FiGithub, FiRefreshCw, FiLogOut, FiCloud } from "react-icons/fi";

export default function Dashboard() {
  const [email, setEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  // Load session
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    const storedToken = localStorage.getItem("github_token");

    if (storedEmail) setEmail(storedEmail);
    if (storedToken) {
      setToken(storedToken);
      loadRepos(storedToken);
    }
  }, []);

  // Logout
  function handleLogout() {
    localStorage.removeItem("email");
    localStorage.removeItem("github_token");
    window.location.href = "/auth";
  }

  // Start OAuth
  async function connectGithub() {
    setLoading(true);
    try {
      const res = await fetch("http://18.140.66.145/github/login");
      const data = await res.json();
      window.location.href = data.url;
    } catch {
      setStatus("Failed to start GitHub login");
    } finally {
      setLoading(false);
    }
  }

  // Handle OAuth callback (code → token)
  async function handleOAuthCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) return;

    setLoading(true);

    try {
      const res = await fetch(
        `http://18.140.66.145/github/callback?code=${code}`
      );

      const data = await res.json();

      if (data.access_token) {
        localStorage.setItem("github_token", data.access_token);
        setToken(data.access_token);

        // clean URL (no code in address bar)
        window.history.replaceState({}, document.title, "/dashboard");

        loadRepos(data.access_token);
      } else {
        setStatus("OAuth failed");
      }
    } catch {
      setStatus("OAuth request failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleOAuthCallback();
  }, []);

  // Load repositories
  async function loadRepos(githubToken: string) {
    setStatus("Loading repositories...");
    setLoading(true);

    try {
      const res = await fetch(
        `http://18.140.66.145/github/repos?token=${githubToken}`
      );
      const data = await res.json();

      if (res.ok) {
        setRepos(data);
        setStatus("");
      } else {
        setStatus("Failed to load repositories");
      }
    } catch {
      setStatus("Network error");
    } finally {
      setLoading(false);
    }
  }

  // Deploy repository
  async function deploy(repoFullName: string) {
    setStatus(`Deploying ${repoFullName}...`);
    setLoading(true);

    try {
      const res = await fetch("http://18.140.66.145/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repo_name: repoFullName,
          token,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus(`Deployed on port: ${data.port}`);
      } else {
        setStatus(data.detail || "Deployment failed");
      }
    } catch {
      setStatus("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FiCloud className="text-blue-600" />
            Dashboard
          </h1>

          <div className="flex gap-4">
            {token ? (
              <button
                onClick={() => loadRepos(token)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg flex items-center gap-2"
              >
                <FiRefreshCw />
                Refresh
              </button>
            ) : (
              <button
                onClick={connectGithub}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg flex items-center gap-2"
                disabled={loading}
              >
                <FiGithub />
                Connect GitHub
              </button>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg flex items-center gap-2"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome{email ? `, ${email}` : ""}
        </h2>
        <p className="text-gray-600 mt-2">
          Manage your apps, deployments, and account here.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="font-bold text-lg">Apps</h3>
            <p className="text-gray-600 mt-2">{repos.length} repositories</p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="font-bold text-lg">Deployments</h3>
            <p className="text-gray-600 mt-2">Managed by containers</p>
          </div>

          <div className="bg-white shadow rounded-xl p-6">
            <h3 className="font-bold text-lg">Status</h3>
            <p className="text-gray-600 mt-2">{status || "Ready"}</p>
          </div>
        </div>

        {/* Repo List */}
        {token && (
          <div className="mt-10">
            <h3 className="text-xl font-semibold text-gray-900">
              Your GitHub Repositories
            </h3>

            {repos.length === 0 ? (
              <p className="text-gray-600 mt-2">
                {loading ? "Loading..." : "No repositories found"}
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {repos.map((repo) => (
                  <div
                    key={repo.full_name}
                    className="p-4 bg-white shadow rounded-xl hover:shadow-md transition"
                  >
                    <h4 className="font-bold">{repo.name}</h4>
                    <p className="text-sm text-gray-600">{repo.full_name}</p>
                    <button
                      onClick={() => deploy(repo.full_name)}
                      className="mt-3 px-4 py-2 bg-blue-800 text-white rounded-lg"
                    >
                      Deploy
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Status */}
        {status && (
          <p className="mt-4 text-sm text-gray-600 bg-white p-3 rounded-lg shadow">
            {status}
          </p>
        )}
      </main>
    </div>
  );
}