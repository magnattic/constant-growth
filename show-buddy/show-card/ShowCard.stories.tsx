import React from 'react';
import { Story, Meta } from '@storybook/react';

import ShowCard from './ShowCard';
import { TvShow } from '../TvShow';
import { aTvShow } from '../../test-data/aTvShow';

export default {
    title: 'shows/ShowCard',
    component: ShowCard,
    argTypes: { showClicked: { action: 'show clicked' } },
} as Meta;

const Template: Story<{ show: TvShow; showClicked: () => void }> = (args) => (
    <ShowCard {...args} />
);

export const DefaultCard = Template.bind({});
DefaultCard.args = { show: aTvShow() };
