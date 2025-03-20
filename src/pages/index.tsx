import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/layout"

const IndexPage: React.FC<PageProps> = () => {

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col">
            <h1>Home</h1>
            <hr />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
