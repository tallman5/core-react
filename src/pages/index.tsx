import React, { useState } from "react"
import type { HeadFC, PageProps } from "gatsby"
import Layout from "../components/layout"
import { EnumDropdown } from "../core-react"

export enum CarColors {
  Red = 'Red', Green = 1, Blue = 'B'
}

export interface ICar {
  carColor: CarColors
}

const IndexPage: React.FC<PageProps> = () => {
  const [car, setCar] = useState<ICar>({ carColor: CarColors.Green })

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
            <EnumDropdown className="form-control" enumObject={CarColors} onEnumChanged={(e) => { setCar({ ...car, carColor: e }); }} defaultValue={car.carColor} />
          </div>
          <div className="col">
            <pre>{JSON.stringify(car, null, 2)}</pre>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
