/**
 * 現在時刻をyyyy-MM-dd hh:mm:ssで返す関数
 * @returns yyyy-MM-dd hh:mm:ss
 */
const getNowDate = () => {
    const date = new Date();
    const str =
        date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getDate()).slice(-2) +
        " " +
        ("0" + date.getHours()).slice(-2) +
        ":" +
        ("0" + date.getMinutes()).slice(-2) +
        ":" +
        ("0" + date.getSeconds()).slice(-2);
    return str;
};

export default getNowDate;
