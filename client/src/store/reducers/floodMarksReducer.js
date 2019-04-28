import SortedSet from 'collections/sorted-set';

const initState = {
    flood_marks: null,
    flood_dates: [],
    timeline: {
        visible: false,
        value: 0,
        prev_value: 0,
        current_date: '1593-07-03'
    }
}

//returning sorted set of floods dates
function getArrayOfFloodDates (unsortedSet) {
    var datesSet = new SortedSet();
    const datesArray = [];
    unsortedSet.forEach(function(nextDate) {
        datesSet.add(nextDate.properties.flood_date);
    });
    datesSet.forEach(function(date) {
        datesArray.push(date);
    })
    return datesArray;
}

const floodMarksReducer = (state = initState, action) => {
    switch (action.type) {
        case 'GET_FLOOD_MARKS_SUCCESS':
            console.log('Downloading flood marks from the database successfully completed.')
            return {
                ...state,
                flood_marks: action.flood_marks
            }
        case 'GET_FLOOD_MARKS_ERROR':
            console.log('Downloading flood marks from the database completed with an error: \n' + action.err)
            return {
                ...state
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
            return {
                ...state
            }
    }
}

export default floodMarksReducer