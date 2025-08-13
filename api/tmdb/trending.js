module.exports = async (req, res) => {
  const page = parseInt(req.query.page || "1", 10);
  const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.TMDB_API_KEY}&language=pt-BR&page=${page}`;
  const r = await fetch(url);
  const data = await r.json();

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
  res.status(200).json(data);
};
