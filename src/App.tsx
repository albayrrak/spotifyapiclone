import { useEffect, useState } from "react";

import "./App.css";
import axios from "axios";
import { IPlaylist } from "./IPlaylist";
import { ITrackList } from "./ITrackList";
import { MdHomeFilled, MdSearch } from "react-icons/md";
import { IoLibrary } from "react-icons/io5";
import { AiFillClockCircle } from "react-icons/ai";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsShuffle,
} from "react-icons/bs";
import { CgPlayTrackNext, CgPlayTrackPrev } from "react-icons/cg";
import { FiRepeat } from "react-icons/fi";
import { ICurrentTrack } from "./ICurrentTrack";
function App() {
  const [token, setToken] = useState<string>("");
  const [playList, setPlayList] = useState<IPlaylist[]>([]);
  const [trackList, setTrackList] = useState<ITrackList[]>([]);
  const [trackListId, setTrackListId] = useState<string>("");
  const [currentTrack, setCurrentTrack] = useState<ICurrentTrack>();

  const handleClick = async () => {
    const client_id = "61cdd710f5154ad1b61ae8750b0d7006";
    const redirect_uri = "http://localhost:5173/";
    const api_uri = "https://accounts.spotify.com/authorize";
    const scope = [
      "user-read-private",
      "user-read-email",
      "user-modify-playback-state",
      "user-read-playback-state",
      "user-read-currently-playing",
      "user-read-recently-played",
      "user-top-read",
    ];
    window.location.href = `${api_uri}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope.join(
      " "
    )}&response_type=token&show_dialog=true`;
  };

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const token2 = hash.substring(1).split("&")[0].split("=")[1];
      const getPlaylistData = async () => {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: "Bearer " + token2,
              "Content-Type": "application/json",
            },
          }
        );
        const { items } = response.data;
        setPlayList(items);
      };

      getPlaylistData();
      setToken(token2);
    }

    const getCurrentTrack = async () => {
      const response = await axios.get(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      setCurrentTrack(response.data.item);
      console.log("responsee", response.data.item);
    };

    getCurrentTrack();
  }, [token, trackListId]);
  const getPlaybackState = async () => {
    const { data } = await axios.get("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    return data;
  };

  console.log("ress", currentTrack?.album);

  const playlistTracks = async (
    playlistId: string = "06VEfA4Fhz44VlHmb2Ec46"
  ) => {
    const request = await axios(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("request", request);

    setTrackList(request.data.items);
  };

  const playTrack = async (trackId: string) => {
    try {
      const request = await axios.put(
        `https://api.spotify.com/v1/me/player/play`,
        {
          uris: [trackId],
          offset: {
            position: 0,
          },
          position_ms: 0,
        },

        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      setTrackListId(trackId);
    } catch (error) {
      console.log(error);
    }
  };

  const msToMinutesAndSeconds = (ms: number) => {
    var minutes = Math.floor(ms / 60000);
    var seconds: any = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  const changeTrack = async (type: string) => {
    const deviceId = await getPlaybackState();
    console.log("alll", deviceId.device.id);

    const request = await axios.post(
      `https://api.spotify.com/v1/me/player/${type}`,
      {
        device_id: deviceId.device.id,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    const response1 = await axios.get(
      "https://api.spotify.com/v1/me/player/currently-playing",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    playTrack(response1.data.item.uri);
    setTrackListId(response1.data.item.uri);
    console.log("response1", response1);
    console.log("response2", request);
  };

  console.log("tracklist", trackListId);

  return (
    <div className="app">
      {token ? (
        <>
          <div className="body">
            <div className="sidebar">
              <div className="logo">
                <img
                  src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_White.png"
                  alt="spotify"
                />
              </div>
              <ul className="menu">
                <li>
                  <MdHomeFilled />
                  <span>Home</span>
                </li>
                <li>
                  <MdSearch />
                  <span>Search</span>
                </li>
                <li>
                  <IoLibrary />
                  <span>Your Library</span>
                </li>
              </ul>
              {playList.map((list, i) => (
                <button key={i} onClick={() => playlistTracks(list.id)}>
                  {list.name}
                </button>
              ))}
            </div>

            <div className="track-list">
              <ul>
                <li>#</li>
                <li>Title</li>
                <li>Album</li>
                <li>
                  <AiFillClockCircle />
                </li>
              </ul>
              {trackList.map((track, i) => (
                <ul key={i} onClick={() => playTrack(track.track.uri)}>
                  <li>{i + 1}</li>

                  <li className="title">
                    <img src={track.track.album.images[0].url} alt="" />
                    <div>
                      <h6>{track.track.name}</h6>
                      {track.track.artists.map((artist) => (
                        <h6>{artist.name}</h6>
                      ))}
                    </div>
                  </li>
                  <li>
                    <span>{track.track.album.name}</span>
                  </li>
                  <li>{msToMinutesAndSeconds(track.track.duration_ms)}</li>
                </ul>
              ))}
            </div>
          </div>
          <div className="footer">
            <div className="footer-track">
              <div className="track-image">
                <img src={currentTrack?.album?.images[1].url} alt="" />
              </div>
              <div className="track-title">
                <h2>{currentTrack?.album.name}</h2>
                <span>{currentTrack?.artists[0].name}</span>
              </div>
            </div>
            <div className="footer-controls">
              <div className="shuffle">
                <BsShuffle />
              </div>
              <div className="previous">
                <CgPlayTrackPrev />
              </div>
              <div className="state">
                <BsFillPauseCircleFill />
              </div>
              <div className="next" onClick={() => changeTrack("next")}>
                <CgPlayTrackNext />
              </div>
              <div className="repeat">
                <FiRepeat />
              </div>
            </div>
            <div className="footer-volume">footer-track</div>
          </div>
        </>
      ) : (
        <button onClick={handleClick}>gönder</button>
      )}
    </div>
  );
}

export default App;
