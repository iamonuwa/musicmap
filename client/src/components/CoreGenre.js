import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spotify from "../containers/Spotify";
import AddNewTrack from "./AddNewTrack";
import Header from "./Header";
import { Container, Table } from "reactstrap";
const token =
  "BQCEgGDO5KKUuD6BvfR1vQdASUPFHOx0AIFHjrra0Jr5PnY1mZ2gBsdWFPFi49iXsgYcPxQSeUODTyMTEQhDmHa9-xKl5sneO2thYO-Ich0RWWucIboeE8Jp2e-2pFpFT9MQPKZmKjKdzpiCNnkWWbUG3P5w43-6LKZVf6pqvyT3qB2k1TUtfeEX";

/**** TODO : Remove hardcoded rows */
let id = 0;
function createData(
  status,
  artist,
  title,
  album,
  duration,
  year,
  provider,
  actions
) {
  id += 1;
  return {
    id,
    status,
    artist,
    title,
    album,
    duration,
    year,
    provider,
    actions
  };
}

class CoreGenre extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genre: "Surf Rock",
      tracks: [],
      totalDuration: "",
      showNotification: false,
      showPlayer: true,
      showNewTrackForm: false,
      currentTrack: {
        src:
          "https://p.scdn.co/mp3-preview/3eb16018c2a700240e9dfb8817b6f2d041f15eb1?cid=774b29d4f13844c495f206cafdad9c86",
        title: "Cut To The Feeling",
        albumThumbnail:
          "https://i.scdn.co/image/966ade7a8c43b72faa53822b74a899c675aaafee",
        album: "Cut To The Feeling",
        artist: "Carly Rae Jepsen",
        year: "2017",
        trackId: {
          spotify: "6EJiVf7U0p1BBfs0qqeb1f"
        }
      }
    };
  }

  async fetchAllTracks() {
    fetch(`http://localhost:4000/tracks`)
      .then(resp => resp.json())
      .then(data => {
        console.log(data);
        this.setState({
          tracks: data.tracks.map(item => {
            return {
              trackId: item.trackId,
              album: item.album,
              title: item.title,
              year: item.year,
              artists: item.artists,
              duration: item.duration
            };
          }),
          totalDuration: this.calculateTotalDuration(data.tracks)
        });
      });
  }

  /**
   * stream data from spotify if you have correct access token
   * @param {string} trackId
   */
  playItOnSpotify(trackId) {
    let accessToken = localStorage.getItem("mm_spotify_access_token");
    if (accessToken) {
      console.log("got access token - " + accessToken);
      fetch({
        url: `https://api.spotify.com/v1/tracks/${trackId}`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + accessToken,
          Accept: "application/json"
        }
      })
        .then(function(response) {
          console.log(response);
          return response.json();
        })
        .then(function(trackInfo) {
          console.log(JSON.stringify(trackInfo));
          //update current track details in player
          this.setState({
            currentTrack: {
              title: trackInfo.name,
              src: trackInfo.href,
              album: trackInfo.album.name,
              artist: trackInfo.artists.name,
              year: trackInfo.album["release_date"].split("-")[0],
              albumThumbnail: trackInfo.album.images[0]
            }
          });
        });
    } else {
      console.log("going to get new token from spotify");
      this.getSpotifyAccessToken();
    }
  }

  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  getHashParams() {
    let hashParams = {};
    let e,
      r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while ((e = r.exec(q))) {
      console.log(e);
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  getSpotifyAccessToken() {
    let clientId = "f329b587614b4f97b8e2aadc26693dbc";
    let scopes = "user-read-email";
    let redirect_uri = "http://localhost:3000/callback/";
    let url =
      "https://accounts.spotify.com/authorize" +
      "?response_type=token" +
      "&client_id=" +
      clientId +
      (scopes ? "&scope=" + encodeURIComponent(scopes) : "") +
      "&redirect_uri=" +
      encodeURIComponent(redirect_uri);
    window.location = url;
  }

  playOnSpotify() {
    this.setState({
      showPlayer: true
    });
  }

  storeTokenAndExpiry() {}
  calculateTotalDuration(songs) {
    let durations = songs.map(song => song.duration);
    let totalDuration = 0;
    durations.forEach(duration => {
      let timings = duration.split(":");
      totalDuration += parseInt(timings[0]) * 60 + parseInt(timings[1]);
    });

    //convert seconds into hours and minutes
    return `${
      parseInt(totalDuration / 3600) > 0
        ? parseInt(totalDuration / 3600) + "hours and"
        : ""
    } ${parseInt((totalDuration % 3600) / 60)} min`;
  }
  handleActionOpen(e) {
    e.preventDefault();
    this.setState({
      showNotification: true
    });
    console.log(e.target.text);
  }

  handleActionClose() {
    this.setState({
      showNotification: false
    });
  }

  addNewTrack() {
    this.setState({
      showNewTrackForm: true
    });
  }
  async componentDidMount() {
    /*
        if(!localStorage.getItem('mm_spotify_access_token')
        && window.location.href.includes('#access_token')) {
            //store access token in localStorage
            let params = this.getHashParams();
            localStorage.setItem('mm_spotify_access_token', params.access_token);
            console.log(" access token : " + localStorage.getItem('mm_spotify_access_token'));
        
        }
        else {
            console.log("stored access token : " + localStorage.getItem('mm_spotify_access_token'));
            //this.playOnSpotify(this.state.currentTrack.trackId.spotify);
        } */

    await this.fetchAllTracks();
  }
  renderTracks() {
    if (this.state.tracks.length > 0) {
      return (
        <Table>
          <thead>
            <tr>
              <th />
              <th>Title</th>
              <th>Album</th>
              <th>Artist</th>
              <th>Duration</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            {this.state.tracks.map(track => (
              <tr key={track.trackId}>
                <td>
                  <i
                    onClick={() => this.playOnSpotify()}
                    className="fa fa-play"
                  />
                </td>
                <td>{track.title}</td>
                <td>{track.album}</td>
                <td>{track.artists}</td>
                <td>{track.duration}</td>
                <td>{track.year}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      );
    } else {
      return (
        <div className="no-genre">
          <h5>No Tracks in this Genre. Why don't you add some!</h5>
        </div>
      );
    }
  }
  render() {
    return (
      <>
        <Header
          totalDuration={this.state.totalDuration}
          totalSongs={this.state.tracks.length}
          onAddNewTrackEvent={this.addNewTrack.bind(this)}
          genre={this.state.genre}
        />
        <Container>{this.renderTracks()}</Container>
        {this.state.showPlayer || window.location.href.includes("callback/") ? (
          <Spotify />
        ) : null}
        <AddNewTrack show={this.state.showNewTrackForm} />
      </>
    );
  }
}

const mapStateToProps = state => {};
CoreGenre.propTypes = {
};

export default CoreGenre;
