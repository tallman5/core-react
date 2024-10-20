import React from 'react'
import { isNullOrWhitespace } from '@tallman5/core-js';

export interface ISeo {
    imagePath: string,
    pageTitle: string,
    description: string,
    pathname: string,
    children?: any[],
    siteName: string,
    siteUrl: string,
    twitterUsername: string
}

export const Seo = (headData: ISeo) => {
    const thisHeadData = {
        fullPateTitle: `${headData.pageTitle} | ${headData.siteName}`,
        description: headData.description,
        image: `${headData.siteUrl}${headData.imagePath}`,
        url: `${headData.siteUrl}${headData.pathname || ``}`,
    };

    const canonicalTag = (isNullOrWhitespace(headData.pathname))
        ? null
        : <link rel="canonical" href={thisHeadData.url} />

    return (
        <>
            {/* HTML Meta Tags */}
            <title>{thisHeadData.fullPateTitle}</title>
            <meta name="description" content={headData.description} />
            <meta name="image" content={thisHeadData.image} />
            {canonicalTag}

            {/* Google Meta Tags */}
            <meta itemProp="name" content={thisHeadData.fullPateTitle} />
            <meta itemProp="description" content={thisHeadData.description} />
            <meta itemProp="image" content={thisHeadData.image} />

            {/* Facebook Meta Tags */}
            <meta property="og:title" content={thisHeadData.fullPateTitle} />
            <meta property="og:description" content={thisHeadData.description} />
            <meta property="og:image" content={thisHeadData.image} />
            <meta property="og:url" content={thisHeadData.url} />
            <meta property="og:type" content="website" />

            {/* Twitter Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={thisHeadData.fullPateTitle} />
            <meta name="twitter:description" content={headData.description} />
            <meta name="twitter:image" content={thisHeadData.image} />
            <meta name='twitter:creator' content={headData.twitterUsername} />
            <meta property="twitter:domain" content={headData.siteUrl}></meta>

            {headData.children}
        </>
    )
}
