import React, { useState } from "react";
import { Button, Card, Col, Input, notification, Row } from "antd";
import request from "../services/request";
import axios from "axios";
import { withRouter } from "react-router";

const PostMovie = ({ history }) => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const onUrlChange = (e) => setYoutubeUrl(e.currentTarget.value);
  const onPostMovie = () => {
    let videoId;
    const url = youtubeUrl
      .replace(/(>|<)/gi, "")
      .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);

    if (url[2] !== undefined) {
      videoId = url[2].split(/[^0-9a-z_-]/i);
      videoId = videoId[0];
    } else {
      videoId = url;
    }
    axios
      .get(
        `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
      )
      .then((res) => {
        const {
          data: { items },
        } = res;
        const [
          {
            snippet: { title, description },
          },
        ] = items;
        request
          .post("/movie", {
            title,
            description,
            movieUrlId: videoId,
          })
          .then(() => history.push("/"));
      })
      .catch(() => {
        notification.error({
          message: "Request Error",
          description: "Something went wrong!",
        });
      });
  };
  return (
    <Card title="Share a Youtube Movie" style={{ width: 600, margin: "auto" }}>
      <Row gutter={[8, 8]}>
        <Col span={4}>Youtube Url:</Col>
        <Col span={20}>
          <Input
            placeholder="Youtube Url"
            value={youtubeUrl}
            onChange={onUrlChange}
          />
        </Col>
        <Col offset={4}>
          <Button type="primary" onClick={onPostMovie}>
            Share
          </Button>
        </Col>
      </Row>
      <Row gutter={[8, 8]}></Row>
    </Card>
  );
};

export default withRouter(PostMovie);
