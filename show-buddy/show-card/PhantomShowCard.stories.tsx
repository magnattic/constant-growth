import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0';

import { PhantomShowCard } from './PhantomShowCard';

export default {
    title: 'shows/PhantomShowCard',
    component: PhantomShowCard,
    decorators: [(Story) => <Story />],
} as Meta;

const Template: Story<{}> = (args) => <PhantomShowCard {...args} />;

export const DefaultCard = Template.bind({});
DefaultCard.args = {};
