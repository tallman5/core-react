import React, { useEffect, useState } from 'react';

interface MetaTag {
    name: string;
    content: string;
}

interface SeoPreviewProps {
    url: string;
}

const SeoPreview: React.FC<SeoPreviewProps> = ({ url }) => {
    const [metaTags, setMetaTags] = useState<MetaTag[]>([]);
    const [title, setTitle] = useState<string | null>(null); // Store the title
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMetaTags = async () => {
            try {
                const proxyUrl = 'https://proxy.cors.sh/';
                const response = await fetch(proxyUrl + url);
                const htmlString = await response.text();
                console.log(url, htmlString);

                // Parse the HTML string
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, 'text/html');

                // Store the document title
                setTitle(doc.title);

                // Extract meta tags
                const metaElements = doc.head.querySelectorAll('meta');
                const metaTagsArray: MetaTag[] = [];

                metaElements.forEach((meta) => {
                    const name = meta.getAttribute('name') || meta.getAttribute('property');
                    const content = meta.getAttribute('content');
                    if (name && content) {
                        metaTagsArray.push({ name, content });
                    }
                });

                setMetaTags(metaTagsArray);
            } catch (err) {
                setError('Failed to fetch meta tags');
            }
        };

        fetchMetaTags();
    }, [url]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (metaTags.length === 0) {
        return <div>Loading meta tags...</div>;
    }

    return (
        <div>
            <h2>SEO Meta Data Preview</h2>
            <div>
                <h3>Google Preview:</h3>
                <p><strong>Title:</strong> {title}</p> {/* Use the title from state */}
                <p><strong>Description:</strong> {metaTags.find(tag => tag.name === 'description')?.content}</p>
            </div>

            <div>
                <h3>Facebook Open Graph Preview:</h3>
                <p><strong>og:title:</strong> {metaTags.find(tag => tag.name === 'og:title')?.content}</p>
                <p><strong>og:description:</strong> {metaTags.find(tag => tag.name === 'og:description')?.content}</p>
                <p><strong>og:image:</strong> {metaTags.find(tag => tag.name === 'og:image')?.content}</p>
            </div>

            <div>
                <h3>LinkedIn Preview:</h3>
                <p><strong>og:title:</strong> {metaTags.find(tag => tag.name === 'og:title')?.content}</p>
                <p><strong>og:description:</strong> {metaTags.find(tag => tag.name === 'og:description')?.content}</p>
                <p><strong>og:image:</strong> {metaTags.find(tag => tag.name === 'og:image')?.content}</p>
            </div>

            <div>
                <h3>Pinterest Preview:</h3>
                <p><strong>pinterest-rich-pin:</strong> {metaTags.find(tag => tag.name === 'pinterest-rich-pin')?.content}</p>
            </div>

            <div>
                <h3>Slack Preview:</h3>
                <p><strong>og:title:</strong> {metaTags.find(tag => tag.name === 'og:title')?.content}</p>
                <p><strong>og:description:</strong> {metaTags.find(tag => tag.name === 'og:description')?.content}</p>
                <p><strong>og:image:</strong> {metaTags.find(tag => tag.name === 'og:image')?.content}</p>
            </div>
        </div>
    );
};

export default SeoPreview;
