/**
 * yyyy-MM-dd, hh:mm:ssの形式で渡されたUTCをJSTに変換する関数
 * @param yyyyMMdd yyyy-MM-dd
 * @param hhmmss hh:mm:ss
 * @returns yyyy-MM-dd+(hh+9)/60 hh+9:mm:ss
 */
const utcToJst = (yyyyMMdd: string, hhmmss: string) => {
    const yyyyMMddReg = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    const hhmmssReg = /^([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
    if (!yyyyMMddReg.test(yyyyMMdd)) {
        throw new Error("yyyyMMdd not match regexp from UTC to JST");
    }
    if (!hhmmssReg.test(hhmmss)) {
        throw new Error("hhmmss not match regexp from UTC to JST");
    }

    const [yyyy, MM, dd] = yyyyMMdd.split("-").map((v) => Number(v));
    const [hh, mm, ss] = hhmmss.split(":").map((v) => Number(v));
    return `${yyyy}-${MM.toString().padStart(2, "0")}-${(
        dd + Math.floor((hh + 9) / 60)
    )
        .toString()
        .padStart(2, "0")} ${((hh + 9) % 24).toString().padStart(2, "0")}:${mm
        .toString()
        .padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
};

export default utcToJst;
