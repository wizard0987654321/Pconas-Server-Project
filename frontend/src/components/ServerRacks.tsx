import DataList from "./DataList";

function ServerRacks() {

    const rows = [
        {
            title: "erti ori sami",
            age: 28,
            profession: "sport",
        },
        {
            title: "otxi xuti ekvsi",
            age: 34,
            profession: "designer",
        },
        {
            title: "shvidi rva",
            age: 41,
            profession: "teacher",
        },
    ];

    const giorguna = [
        {
            tashi: "erti ori sami rva cxra ati tashi bicho giorgunaaaaaa",
            jig: 28,
            giorguna: "sport",
            argoushva: "ebochuna",
            daukvirdi: "magasao",
            magikidis: "kabasao"
        },
        {
            tashi: "otxi xuti ekvsi",
            jig: 34,
            giorguna: "designer",
        },
        {
            title: "shvidi rva",
            jig: 41,
            profession: "teacher",
        },
    ];

    return (
        <>
            <DataList data={giorguna} />
        </>
    )
}

export default ServerRacks;