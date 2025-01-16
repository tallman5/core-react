import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/layout"
import EnumDropdown from "../core-react/components/enumDropdown"

enum TestColors {
  Red = "Red",
  Green = "Green",
  Blue = "Blue",
}

const IndexPage: React.FC<PageProps> = () => {
  const [selectedColor, setSelectedColor] = React.useState<keyof typeof TestColors | undefined>(TestColors.Blue);

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
              value={selectedColor}
              onChange={(color) => setSelectedColor(color)}
              className='form-select' />
          </div>
          <div className="col">Selected Color: {selectedColor}</div>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
