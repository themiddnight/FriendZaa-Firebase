const convertDate = (timestamp) => {
    return timestamp.toDate().toLocaleString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    })
}

module.exports = convertDate;