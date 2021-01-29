import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import { BlogEntry, loadBlogEntries } from '../contentful/loadBlogEntries';

interface Props {
    blogEntries: BlogEntry[];
}

const Entry = ({ entry }: { entry: BlogEntry }) => {
    const [scrollY, setScrollY] = useState(0);
    const [languages, setLanguages] = useState('');
    useEffect(() => {
        setLanguages(navigator.languages.join(','));
    }, []);
    useEffect(() => {
        const handleScroll = () => setScrollY(window?.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <div>
            <div>{entry.title}</div>
            <div>{languages}</div>
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
