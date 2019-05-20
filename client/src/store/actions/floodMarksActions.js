import axios from 'axios';

//Sending request for getting flood marks from Geopackage data base (from php server)
export const getFloodMarksFromBase = async (dispatch) => {
    await axios.get(`http://keyboarders.usermd.net/historic-water-server/GetFloodMarks.php`)
    .then((response) => {
        const floodMarks = response.data.features
        dispatch({ 
            type: 'GET_FLOOD_MARKS_SUCCESS',
            flood_marks: floodMarks });
        })
    .catch(err => {
        dispatch({err});
        });
}

//Setting current and previous value for timeline
export const setFloodDates = () => {
    return {
        type: 'SET_FLOOD_DATES'
    }
}

//Setting current and previous value for timeline
export const setTimelineValues = (floodIndex) => {
    return {
        type: 'SET_TIMELINE_VALUES',
        newValueTimeline: floodIndex
    }
}

//Making timeline visible if it will be chosen from select list.
export const changeTimelineVisibility = (value) => {
    if(value==='Linia czasu') {
        return {
            type: 'TIMELINE_VISIBILE'
        }
    } else {
        return {
            type: 'TIMELINE_INVISIBILE'
        }
    }
}