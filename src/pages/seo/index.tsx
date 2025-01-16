import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../../components/layout"
import SeoPreview from "../../core-react/components/seoPreview"

const SeoIndex: React.FC<PageProps> = () => {
    const [urls, setUrls] = React.useState([
        `https://www.google.com`,
        `https://www.bing.com`,
        `https://www.mcgurkin.net`
    ])
    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1>SEO Testing</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        {
                            urls.map((url, index) => {
                                return (
                                    <div key={index}>
                                        <SeoPreview url={url} />
                                        <br />
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default SeoIndex

export const Head: HeadFC = () => <title>SEO Testing</title>
