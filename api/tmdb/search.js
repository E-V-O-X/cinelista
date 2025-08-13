export default async function handler(req, res) {
  const q = req.query.q || "";
  const r = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(q)}`
  );
  const data = await r.json();
  res.status(200).json(data);
}
