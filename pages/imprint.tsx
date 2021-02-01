import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { BlogEntry, loadBlogEntries } from '../contentful/loadBlogEntries';
import styles from './imprint.module.scss';

interface Props {
    blogEntries: BlogEntry[];
}

const Entry = ({ entry }: { entry: BlogEntry }) => {
    const [scrollY, setScrollY] = useState(0);
    const [languages, setLanguages] = useState('');
    useEffect(() => {
        setLanguages(navigator.languages.join(','));

        const handleScroll = () => setScrollY(window?.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const transformImageUrl = (url: string) =>
        `https:${url}?w=500&fm=jpg&fl=progressive`;

    return (
        <div className={styles.content}>
            <h2>{entry.title}</h2>
            {entry.heroImage && (
                <img src={transformImageUrl(entry.heroImage.fields.file.url)} />
            )}
            <div>
                <ReactMarkdown transformImageUri={transformImageUrl}>
                    {entry.body}
                </ReactMarkdown>
            </div>
            <div>{scrollY}</div>
        </div>
    );
};

export const Imprint = ({ blogEntries }: Props) => {
    return blogEntries.map((entry) => (
        <Entry key={entry.title} entry={entry} />
    ));
};

export const getStaticProps: GetStaticProps<Props> = async () => {
    const blogEntries = await loadBlogEntries();

    return {
        props: {
            blogEntries,
        },
    };
};

export default Imprint;
