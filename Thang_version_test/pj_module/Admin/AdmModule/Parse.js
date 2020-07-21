const State = require('../../Config/Parse')

exports.parseState = function (state) {
    return State.State[parseInt(state)]
}
exports.parseClassState = function (state) {
    return State.ClassState[parseInt(state)]
}
exports.parseLevel = function (level) {
    return State.Level[parseInt(level)]
}
exports.parseDate = function (Da) {
    return (new Date().getTime() - Date.parse(Da));
}
exports.parseDateStart = function (dashboardType, displayType) {
    if (dashboardType == 0) {
        let nowTime = new Date();
        let dayIndex = nowTime.getDay();
        dayIndex = (dayIndex != 0) ? dayIndex : 7;
        dayIndex = (displayType == 0) ? dayIndex : 7;
        listState = []
        for (let i = 0, j = nowTime.getDay(); i < dayIndex; i++, j--) {
            if (j < 0) j = 6
            listState.push(State.DashBoard.Week[j])
        }
        nowTime.setDate(nowTime.getDate() - dayIndex+1)
        return [
            nowTime.toISOString().substring(0, 10),
            listState.reverse()
        ]
    }
    else if (dashboardType == 1) {
        let nowTime = new Date()
        listState = []
        if (displayType == 0) {
            let month = nowTime.getMonth() + 1;
            for (let i = 1; i <= nowTime.getDate(); i++) {
                listState.push(i + "/" + month);
            }
            nowTime.setDate(1);
        }
        else {
            let nowMonth = nowTime.getMonth() + 1;
            nowTime.setDate(nowTime.getDate() - 29);
            let startdate = nowTime.getDate();
            let pastMonth = nowTime.getMonth() + 1;
            let endMonthDate = new Date(nowTime.getFullYear(), nowTime.getMonth() + 1, 0).getDate()
            for (let i = 0, j = startdate, month = pastMonth; i < 30; i++, j++) {
                listState.push(j + "/" + month)
                if (j === endMonthDate) {
                    month = nowMonth
                    j = 0
                }
            }
        }
        return [
            nowTime.toISOString().substring(0, 10),
            listState
        ]
    }
    else if (dashboardType == 2) {
        return ["",]
    }
}
exports.parseDateDash = function (lisst, DayStart) {
    if (lisst.length == 0) return []
    let t = DayStart.split('-')
    let dayStart = parseInt(t[2])
    let monthStart = parseInt(t[1])

    let nowDate = new Date()
    let Year = nowDate.getFullYear()
    let endDate = nowDate.getDate() + 1;
    let endMonth = nowDate.getMonth() + 1;
    let loopDay = dayStart, loopMonth = monthStart;
    let endOfMonth = new Date(Year, monthStart, 0).getDate()

    let index = 0, listSize = lisst.length;
    let returnVal = []

    let compareValue = 100 * (parseInt(lisst[index]._id.substring(5, 7))) + parseInt(lisst[index]._id.substring(8, 10))
    
    while (!(loopDay == endDate && loopMonth == endMonth)) {
        if (index == listSize || (compareValue != (loopDay + 100 * loopMonth))) {
            returnVal.push(0)
        }
        else {
            returnVal.push(lisst[index].count)
            index++;
            if (index < listSize)
                compareValue = 100 * (parseInt(lisst[index]._id.substring(5, 7))) + parseInt(lisst[index]._id.substring(8, 10))
        }


        if (loopDay == endOfMonth) {
            loopMonth++;
            endOfMonth = new Date(Year, loopMonth, 0).getDate()
            loopDay = 0
        }
        loopDay++;
    }
    return returnVal
}