module.exports = async (req, res) => {
  const qs = req.url.split("?")[1] || ""; // repassa os parâmetros (ex.: with_genres=12)
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=pt-BR&sort_by=popularity.desc&${qs}`;
  const r = await fetch(url);
  const data = await r.json();

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
  res.status(200).json(data);
};
