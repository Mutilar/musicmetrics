const fetch = require("isomorphic-unfetch");
const { promises: fs } = require("fs");
const path = require("path");

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

async function main() {
  const readmeTemplate = (
    await fs.readFile(path.join(process.cwd(), "./README.template.md"))
  ).toString("utf-8");

  const { access_token } = await (
    await fetch(
      `https://accounts.spotify.com/api/token?grant_type=refresh_token&client_id=${clientId}&client_secret=${clientSecret}&refresh_token=${refreshToken}`,
      {
        headers: {
          "content-type": "application/x-www-form-urlencoded ",
        },
        method: "POST",
      }
    )
  ).json();

  const { total: sp_liked } = await (
    await fetch("https://api.spotify.com/v1/me/tracks", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  ).json();

  const { total: sp_abl } = await (
    await fetch("https://api.spotify.com/v1/me/albums", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  ).json();

  const { total: sp_pl } = await (
    await fetch("https://api.spotify.com/v1/me/playlists", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  ).json();

  const { items: sp_artists } = await (
    await fetch("https://api.spotify.com/v1/me/top/artists?time_range=short_term", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  ).json();

  const { items: sp_tracks } = await (
    await fetch("https://api.spotify.com/v1/me/top/tracks?time_range=short_term", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
  ).json();

  // TODO: Call post processing on outputs here.
  const readme = readmeTemplate
    .replace("{sp_liked}", sp_liked)
    .replace("{sp_abl}", sp_abl)
    .replace("{sp_pl}", sp_pl)
     // Hardcoded for now, will add to PP module for better formatting.
    .replace("{sp_artists}", '![artists](' + sp_artists[0]['images'][2]['url'] + ')' + ' ' + '![artists](' + sp_artists[1]['images'][2]['url'] + ')' + ' ' + '![artists](' + sp_artists[2]['images'][2]['url'] + ')')
    //.replace("{sp_tracks}", sp_tracks[0]['name'] + '\n\n\t' + sp_tracks[1]['name'] + '\n\n\t' + sp_tracks[2]['name'] + '\n\n\t')

  await fs.writeFile("README.md", readme);
}

main();
