export default async function handler(req, res) {
  const r = await fetch(
    `https://api.themoviedb.org/3/trending/movie/day?api_key=${process.env.TMDB_API_KEY}&language=pt-BR`
  );
  const data = await r.json();
  res.status(200).json(data);
}
