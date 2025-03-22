import React from "react";
import type { HeadFC } from "gatsby";
import Layout from "../components/layout";
import { PanZoom, PanZoomSpring } from "../core-react";

const IndexPage = () => {
  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col">
            <h1>Home</h1>
          </div>
        </div>
        <div className="row">
          <div className="col border" style={{ height: '300px' }}>
            <PanZoom>
              <img src="../meta-image.webp" alt="Zoomable Content" />
            </PanZoom>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
export const Head: HeadFC = () => <title>Home Page</title>;
