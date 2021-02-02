import React, { useContext } from 'react';
import { Card } from 'react-bootstrap';
import { ShowApiContext } from '../show-api/ShowApiContext';
import { TvShow } from '../TvShow';
import styles from './ShowCard.module.scss';

const ShowCard: React.FC<{
    show: TvShow | null;
    showClicked: () => void;
}> = (props) => {
    const show = props.show;

    const showApi = useContext(ShowApiContext);

    return (
        <Card className={styles.suggestion} onClick={() => props.showClicked()}>
            {show && (
                <React.Fragment>
                    <Card.Img
                        src={showApi.getShowPoster(show)}
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
                                        {new Date(
                                            show.first_air_date
                                        ).getFullYear()}
                                    </time>
                                )}
                            </div>
                            <p className="col-6">{show.vote_average}</p>
                        </div>
                        <Card.Text className={styles.showDescription}>
                            {show.overview}
                        </Card.Text>
                    </Card.Body>
                </React.Fragment>
            )}
        </Card>
    );
};

export default React.memo(ShowCard);
