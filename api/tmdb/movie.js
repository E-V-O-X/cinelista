export default async function handler(req, res) {
  const id = req.query.id;
  if (!id) return res.status(400).json({ error: "missing id" });
  const r = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
  );
  const data = await r.json();
  res.status(200).json(data);
}
