import { useRef, memo } from "react";
import { useSubscription, dispatch } from "../../jekyll";
import "./Alien.css";
import { UserSettingsPage, createComponent } from '../../mrhyde';

const Checkbox = ({ id }) => {
    const isChecked = useSubscription(
        ["ui", "aliens", "selections"],
        (selections) => selections.includes(id)
    )
    const onChange = () => {
        dispatch(["ui-select-alien", { id: id, add: !isChecked }])
    }
    return <input type="checkbox" checked={isChecked} onChange={onChange} />;
};

const AlienDetails = ({ alien }) => (
    <>
        <span className="card-column">{alien.first_name}</span>
        <span className="card-column">{alien.last_name}</span>
        <span className="card-column">{alien.email}</span>
        <span className="card-column">{alien.age}</span>
        <span className="card-column text-left">{alien.favorite_animal}</span>
        <span className="card-column">
            <button onClick={() => dispatch(["ui-set-alien-to-edit", alien.id])}>edit</button>
            <button onClick={() => dispatch(["ui-delete-alien", alien.id])}>delete</button>
            <button onClick={() => dispatch(["ui-set-alien-to-view", alien.id])}>view</button>
        </span>
    </>
);

const AlienForm = ({ alien }) => {
    const firstNameRef = useRef(alien.first_name);
    const lastNameRef = useRef(alien.last_name);
    const emailRef = useRef(alien.email);
    const ageRef = useRef(alien.age);
    const favoriteAnimalRef = useRef(alien.favorite_animal);

    const onSubmit = () => {
        const payload = {
            first_name: firstNameRef.current.value,
            last_name: lastNameRef.current.value,
            email: emailRef.current.value,
            age: parseInt(ageRef.current.value),
            favorite_animal: favoriteAnimalRef.current.value,
        };

        dispatch(["ui-update-alien-info", { ...alien, ...payload }]);
    };

    const cancelEdit = () => dispatch(["ui-edit-alien/cancel-edit", alien.id]);

    return (
        <>
            <span className="card-column">
                <input ref={firstNameRef} name="first_name" defaultValue={alien.first_name} />
            </span>
            <span className="card-column">
                <input ref={lastNameRef} name="last_name" defaultValue={alien.last_name} />
            </span>
            <span className="card-column">
                <input ref={emailRef} name="email" defaultValue={alien.email} />
            </span>
            <span className="card-column">
                <input ref={ageRef} name="age" defaultValue={alien.age} />
            </span>
            <span className="card-column text-left">
                <input ref={favoriteAnimalRef} name="favorite_animal" defaultValue={alien.favorite_animal} />
            </span>
            <span className="card-column">
                <button onClick={onSubmit}>save</button>
                <button onClick={cancelEdit}>cancel</button>
            </span>
        </>
    )
};

const AlienEditableDetailsView = ({ alien, isEditing }) => {
    return isEditing ? <AlienForm alien={alien} /> : <AlienDetails alien={alien} isEditing={isEditing} />;
};

const AlienEditableDetails = createComponent({
    renderer: AlienEditableDetailsView,
    subscriptions: ({ alien }) => ([
        [['ui', 'aliens', 'aliensBeingEdited']],
        (aliensBeingEdited) => {
            return [aliensBeingEdited.includes(alien.id)];
        },
    ]),
    computedProps: (props) => {
        return ({
            isEditing: props.aliensBeingEdited,
        })
    }
});


const AlienView = ({ id, alien }) => {
    return (
        <div id={`alien-${id}`} style={{ display: "flex", alignItems: "center" }}>
            <Checkbox id={id} />
            <div className="card">
                <span className="card-column text-left"><img alt="hello" src={""} /></span>
                <AlienEditableDetails alien={alien} />
            </div>
        </div>
    );
}

const Alien_ = createComponent({
    subscriptions: ({ id }) => ([
        [['aliens', id]],
    ]),
    computedProps: (componentEnvironment) => ({
        alien: componentEnvironment[componentEnvironment.id],
    }),
    renderer: AlienView
});

const Alien = memo(Alien_); // memoize component to avoid re-rendering on `deletion`

const AliensView = ({ aliens }) => {
    return (
        <div className="card-container">
            <UserSettingsPage id={1} />
            {aliens.map((id) => <Alien key={id} id={id} />)}
        </div>
    );
};

const Aliens = createComponent({
    subscriptions: () => ([
        [['ui', 'aliens', 'aliensToShow']],
    ]),
    computedProps: ({ aliensToShow }) => ({
        aliens: aliensToShow,
    }),
    renderer: AliensView
})

export default Aliens;
