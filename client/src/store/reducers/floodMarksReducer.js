const initState = {
    timeline: {
        visible: false,
        value: 0,
        prev_value: 0,
        current_date: '1593-07-03'
    }
}

//returning sorted set of floods dates
const getArrayOfFloodDates = (objectsWithDates) => {
    const unsortedSet = new Set()
    objectsWithDates.forEach((object) => {
        unsortedSet.add(object.properties.flood_date)
    })
    return Array.from(unsortedSet).sort();
}

const floodMarksReducer = (state = initState, action) => {
    switch (action.type) {
        case 'GET_FLOOD_MARKS_SUCCESS':
            console.log('Downloading flood marks from the database successfully completed.')
            return {
                ...state,
                flood_marks: action.flood_marks
            }
        case 'SET_FLOOD_DATES':
            return {
                ...state,
                flood_dates: getArrayOfFloodDates(state.flood_marks)
            }
        case 'SET_TIMELINE_VALUES': 
            return {
                ...state,
                timeline: {
                    ...state.timeline,
                    value: action.newValueTimeline,
                    prev_value: state.valueTimeline,
                    current_date: state.flood_dates[action.newValueTimeline]
                }
            }

        case 'TIMELINE_VISIBILE':
            return {
                ...state,
                timeline: {
                    ...state.timeline,
                    visible: true
                }
            }
        case 'TIMELINE_INVISIBILE':
            return {
                ...state,
                timeline: {
                    ...state.timeline,
                    visible: false
                }
            }
        case 'SET_FLOODS_DATES':
            return {
                ...state,
                floods_dates: getArrayOfFloodDates(state.flood_marks)
            }
        default:
            if(action.err) console.log(action.err);
            return {
                ...state
            }
    }
}

export default floodMarksReducer