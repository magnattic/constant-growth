import cn from 'classnames';
import React from 'react';
import { Card } from 'react-bootstrap';
import { aTvShow } from '../../test-data/aTvShow';
import styles from './PhantomShowCard.module.scss';
import baseStyles from './ShowCard.module.scss';

const show = aTvShow();

export const PhantomShowCard: React.FC = (props) => (
    <Card className={cn(baseStyles.card, styles.phantomCard)}>
        <Card.Img
            src="/dummy.jpg"
            variant={'top'}
            className={styles.showImage}
        ></Card.Img>
        <Card.Body>
            <Card.Title>{show.name}</Card.Title>
            <div className="row">
                <div className="col-6">
                    {show.first_air_date && (
                        <time
                            className={styles.firstAirDate}
                            dateTime={show.first_air_date}
                        >
                            {new Date(show.first_air_date).getFullYear()}
                        </time>
                    )}
                </div>
                <p className="col-6">{show.vote_average}</p>
            </div>
            <Card.Text className={styles.showDescription}>
                {show.overview}
            </Card.Text>
        </Card.Body>
    </Card>
);

export default React.memo(PhantomShowCard);
