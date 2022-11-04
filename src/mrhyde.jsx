import { useMemo } from 'react';
import { useSubscription } from './jekyll';

const subscriptionsToProps = (subscriptions, values) => {
    return subscriptions.reduce((acc, subscriptionPath, index) => {
        const lastPath = subscriptionPath[subscriptionPath.length - 1];
        acc[lastPath] = values[index];
        return acc;
    }, {});
};

export const createComponent = (options) => {
    const { renderer: Component, subscriptions, computedProps = () => ({}) } = options;
    const Component_ = (props) => {

        const [paths, transformFn = (x) => ([x])] = useMemo(() => subscriptions(props), [props, subscriptions]);
        const subscriptionsValues = useSubscription(paths, transformFn);
        const props_ = { ...props, ...subscriptionsToProps(paths, subscriptionsValues) };
        const allProps = { ...props_, ...computedProps(props_) };

        return <Component {...allProps} />
    };
    return Component_;
};

const UserSettingsView = ({ person, alien }) => {
    return (
        <div>
            Display: { alien.first_name}<br />
        Person: { person}
        </div>
    );
};

export const UserSettingsPage = createComponent({
    renderer: UserSettingsView,
    subscriptions: ({ id }) => ([
        [['aliens', id]],
    ]),
    computedProps: (componentEnvironment) => {
        return {
            display: `person ${componentEnvironment.person}`,
            alien: componentEnvironment[componentEnvironment.id],
        }
    }
});
