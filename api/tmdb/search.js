module.exports = async (req, res) => {
  const q = (req.query.q || "").toString().trim();
  const page = parseInt(req.query.page || "1", 10);
  if (!q) return res.status(400).json({ error: "missing query" });

  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(q)}&page=${page}`;
  const r = await fetch(url);
  const data = await r.json();

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
  res.status(200).json(data);
};
