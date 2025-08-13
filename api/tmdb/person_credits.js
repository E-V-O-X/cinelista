module.exports = async (req, res) => {
  const id = Number(req.query.id);
  if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: "invalid id" });

  const url = `https://api.themoviedb.org/3/person/${id}/movie_credits?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`;
  const r = await fetch(url);
  const data = await r.json();

  res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=60");
  res.status(200).json(data);
};
