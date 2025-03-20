import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/layout"
import { EnumDropdown } from "../core-react/components/enumDropdown";

enum TestColors {
  Red = "Red",
  Green = "Green",
  Blue = "Blue",
}

const IndexPage: React.FC<PageProps> = () => {
  const [color, setColor] = React.useState<keyof typeof TestColors | undefined>(undefined);

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col">
            <h1>Home</h1>
            <hr />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h2>Enum Dropdown</h2>
            <p>A simple select element which is bound to an enum type.</p>
          </div>
        </div>
        <div className="row">
          <div className="col-2">
            <EnumDropdown enumObject={TestColors}
              value={color}
              onChange={(color) => setColor(color)}
              className='form-select' />
          </div>
          <div className="col">Selected Color: {color}</div>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
