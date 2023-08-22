import axios from '../../../plugins/axios';


export const getPlaylistTracks = async (req: any, res: any) => {
  try {
    const { data: spotifyPlaylistTracks } = await axios({
      method: 'get',
      url: `https://api.spotify.com/v1/playlists/${req.params.id}/tracks`,
      headers: { Authorization: `Bearer ${req.query.token}` },
    });
    const trackObjArray = spotifyPlaylistTracks.items.map((playlistTrack: any) => (playlistTrack.track))
    res.status(200).send(trackObjArray).end();

  } catch (error: any) {
    console.error('Error retrieving playlist tracks: ', error.response?.statusText || error.message);
    res.status(error.response?.status || 500).send(error.response?.statusText || error.message).end();
  }

  return;
}