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

const Seo = ({ siteUrl, siteName, pageTitle, description, pathname, twitterUsername, imagePath, children }: ISeo) => {
    const headData = {
        fullPateTitle: `${pageTitle} | ${siteName}`,
        description: description,
        image: `${siteUrl}${imagePath}`,
        url: `${siteUrl}${pathname || ``}`,
    };

    const canonicalTag = (isNullOrWhitespace(pathname))
        ? null
        : <link rel="canonical" href={headData.url} />

    return (
        <>
            {/* HTML Meta Tags */}
            <title>{headData.fullPateTitle}</title>
            <meta name="description" content={headData.description} />
            <meta name="image" content={headData.image} />
            {canonicalTag}

            {/* Google Meta Tags */}
            <meta itemProp="name" content={headData.fullPateTitle} />
            <meta itemProp="description" content={headData.description} />
            <meta itemProp="image" content={headData.image} />

            {/* Facebook Meta Tags */}
            <meta property="og:title" content={headData.fullPateTitle} />
            <meta property="og:description" content={headData.description} />
            <meta property="og:image" content={headData.image} />
            <meta property="og:url" content={headData.url} />
            <meta property="og:type" content="website" />

            {/* Twitter Meta Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={headData.fullPateTitle} />
            <meta name="twitter:description" content={headData.description} />
            <meta name="twitter:image" content={headData.image} />
            <meta name='twitter:creator' content={twitterUsername} />
            <meta property="twitter:domain" content={siteUrl}></meta>

            {children}
        </>
    )
}

export default Seo
