import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";
import { IPlaylist } from "./IPlaylist";
import { ITrackList } from "./ITrackList";
function App() {
  const clientId = "61cdd710f5154ad1b61ae8750b0d7006";
  const secretId = "14ac13881d824b3cb5c2f40eeddafc8b";
  const [token, setToken] = useState<string>("");
  const [playList, setPlayList] = useState<IPlaylist[]>([]);
  const [trackList, setTrackList] = useState<ITrackList[]>([]);

  const handleClick = () => {
    const clientId = "61cdd710f5154ad1b61ae8750b0d7006";
    const redirectUrl = "http://localhost:5173/";
    const apiUrl = "https://accounts.spotify.com/authorize";
    const scope = [
      "user-read-email",
      "user-read-private",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-read-recently-played",
      "user-read-playback-position",
      "user-top-read",
      "playlist-read-private",
    ];
    window.location.href = `${apiUrl}?client_id=${clientId}&redirect_uri=${redirectUrl}&${scope.join(
      ""
    )}&response_type=token&show_daialog=true`;
  };

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const token = hash.substring(1).split("&")[0].split("=")[1];
      console.log(token);
    }

    const getPlaylistData = async () => {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/playlists",
        {
          headers: {
            Authorization:
              "Bearer BQBcpxx_76dU5Zc5efUU8kLGGRU7TCmC6u49Qv1NYH9i_FtqFUrRkK2BfTV5JWI83sKzXh7mf-Kkr6epFK_vk1a0OJspsCbE5zVOSx9XQJFbgKRkv-TOmvq5YXVyXNwSq5_E8vocwI4RdOtGBi4LGya5hqISIpDpfJO3Hvjmyn2npxQ",
            "Content-Type": "application/json",
          },
        }
      );
      const { items } = response.data;
      setPlayList(items);
    };
    getPlaylistData();
  }, [token]);

  console.log(playList);

  const playlistTracks = async (
    playlistId: string = "06VEfA4Fhz44VlHmb2Ec46"
  ) => {
    const request = await axios(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization:
            "Bearer BQBcpxx_76dU5Zc5efUU8kLGGRU7TCmC6u49Qv1NYH9i_FtqFUrRkK2BfTV5JWI83sKzXh7mf-Kkr6epFK_vk1a0OJspsCbE5zVOSx9XQJFbgKRkv-TOmvq5YXVyXNwSq5_E8vocwI4RdOtGBi4LGya5hqISIpDpfJO3Hvjmyn2npxQ",
          "Content-Type": "application/json",
        },
      }
    );
    console.log("request", request);

    setTrackList(request.data.items);
  };

  const playTrack = async (trackId: string) => {
    console.log(trackId);

    const request = await axios.put(
      `https://api.spotify.com/v1/me/player/play`,

      {
        headers: {
          Authorization:
            "Bearer BQBcpxx_76dU5Zc5efUU8kLGGRU7TCmC6u49Qv1NYH9i_FtqFUrRkK2BfTV5JWI83sKzXh7mf-Kkr6epFK_vk1a0OJspsCbE5zVOSx9XQJFbgKRkv-TOmvq5YXVyXNwSq5_E8vocwI4RdOtGBi4LGya5hqISIpDpfJO3Hvjmyn2npxQ",
          "Content-Type": "application/json",
        },
      }
    );
    console.log(request);
  };
  console.log(trackList);

  return (
    <div className="app">
      {/* <button onClick={handleClick}>gönder</button> */}
      <div className="sidebar">
        <h1>Spotify Clone</h1>
        {playList.map((list) => (
          <>
            <button onClick={() => playlistTracks(list.id)}>{list.name}</button>
          </>
        ))}
      </div>

      <div className="track-list">
        {trackList.map((track) => (
          <ul onClick={() => playTrack(track.track.id)}>
            <li>{track.track.name}</li>
            <li>{track.track.artists[0].name}</li>
            <li>
              <img src={track.track.album.images[0].url} alt="" />
            </li>
            <li>test</li>
          </ul>
        ))}
      </div>
    </div>
  );
}

export default App;
