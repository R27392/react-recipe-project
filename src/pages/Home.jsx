import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import RecipeCard from "../components/RecipeCard";

const LIMIT = 6;

function Home() {
  const [recipes, setRecipes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const requestId = useRef(0);

  async function fetchRecipes(skipCount, query = "") {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setErrorMsg("");

    try {
      const url = query
        ? "https://dummyjson.com/recipes/search"
        : "https://dummyjson.com/recipes";

      const { data } = await axios.get(url, {
        params: { limit: LIMIT, skip: skipCount, ...(query && { q: query }) },
      });

      // Ignore responses from outdated requests
      if (currentRequest !== requestId.current) return;

      setRecipes((prev) =>
        skipCount === 0 ? data.recipes : [...prev, ...data.recipes],
      );
      setTotal(data.total);
      setSearchQuery(query);
    } catch (error) {
      if (currentRequest !== requestId.current) return;
      setErrorMsg("Something went wrong. Please try again later.");
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }

  useEffect(() => {
    fetchRecipes(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const query = new FormData(e.target).get("query").trim();
    fetchRecipes(0, query);
  }

  const isInitialLoad = loading && recipes.length === 0 && !errorMsg;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <form
        onSubmit={handleSearch}
        className="flex gap-2 max-w-md mx-auto mb-8"
      >
        <input
          type="text"
          name="query"
          placeholder="Search recipes..."
          className="flex-1 border border-border rounded px-3 py-2 bg-card text-text outline-none focus:border-accent"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-accent hover:bg-accent-hover text-white rounded px-4 py-2 font-medium disabled:opacity-60"
        >
          Search
        </button>
      </form>

      {errorMsg && <p className="text-accent text-center mb-6">{errorMsg}</p>}

      {isInitialLoad && (
        <p className="text-center py-6 text-muted">Loading...</p>
      )}

      {!loading && !errorMsg && recipes.length === 0 && (
        <p className="text-center py-6 text-muted">
          {searchQuery
            ? `No recipes found for '${searchQuery}'`
            : "No recipes found."}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {recipes.length > 0 && recipes.length < total && (
        <div className="text-center mt-8">
          <button
            type="button"
            disabled={loading}
            onClick={() => fetchRecipes(recipes.length, searchQuery)}
            className="bg-accent hover:bg-accent-hover text-white rounded px-6 py-2 font-medium disabled:opacity-60"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </main>
  );
}

export default Home;
