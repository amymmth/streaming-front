import {FC, useEffect, useState} from "react";
import SimpleKeyboard, {KeyboardReactInterface} from "react-simple-keyboard";


type KeyboardProps = KeyboardReactInterface["options"] & {
    onclose: () => void;
}

export const Keyboard: FC<KeyboardProps> = (props) => {
    const {onclose, ...rest} = props;
    const [layout, setLayout] = useState("russian");
    const [language, setLanguage] = useState("russian");
    const [shift, setShift] = useState(false);
    const [symbols, setSymbols] = useState(false);

    const handleLanguageSwitch = () => {
        setLanguage(prev => prev === "english" ? "russian" : "english");
    };

    const onKeyPress = (button: string) => {
        if (button === "{lang}") handleLanguageSwitch();
        if (button === "{shift}") handleShift();
        if (button === "{symbols}") handleSymbolsToggle();
        if (button === "{abc}") handleSymbolsToggle();
        if (button === "{ok}") handleReturn();
        if (button === "{return}") handleReturn();
    };

    const handleReturn = () => {
        onclose()
    };

    const handleShift = () => {
        setShift(prev => !prev);
    };

    const handleSymbolsToggle = () => {
        setSymbols(prev => !prev);
    };


    const layouts = {
        english: [
            "1 2 3 4 5 6 7 8 9 0 {bksp}",
            "q w e r t y u i o p",
            'a s d f g h j k l',
            "z x c v b n m ?",
            "{shift} {symbols} {lang} {space} {enter} {ok}"
        ],
        shiftEnglish: [
            "1 2 3 4 5 6 7 8 9 0 {bksp}",
            "Q W E R T Y U I O P",
            'A S D F G H J K L',
            "Z X C V B N M ?",
            "{shift} {symbols} {lang} {space} {enter} {ok}"
        ],
        russian: [
            "1 2 3 4 5 6 7 8 9 0 {bksp}",
            "й ц у к е н г ш щ з х",
            "ф ы в а п р о л д ж э",
            "я ч с м и т ь Ъ б ю ?",
            "{shift} {symbols} {lang} {space} {enter} {return}"
        ],
        shiftRussian: [
            "1 2 3 4 5 6 7 8 9 0 {bksp}",
            "Й Ц У К Е Н Г Ш Щ З Х",
            "Ф Ы В А П Р О Л Д Ж Э",
            "Я Ч С М И Т Ь Ъ Б Ю ?",
            "{shift} {symbols} {lang} {space} {enter} {return}"
        ],
        symbols: [
            "1 2 3 4 5 6 7 8 9 0 {bksp}",
            "- \\ : ; ( ) ₽ & @ \"",
            ". , ? ! ' `",
            "{shift} {abc} {lang} {space} {enter} {return}"
        ],
        shiftSymbols: [
            "[ ] { } # % ^ * + = {bksp}",
            "_ \\ | ~ < > $ € £ @ •",
            ". , ? ! ' `",
            "{shift} {abc} {lang} {space} {enter} {return}"
        ]
    };

    const display = {
        "{lang}": language === "russian" ? "RU" : "EN",
        "{bksp}": "⌫",
        "{shift}": "⇧",
        "{enter}": "⏎",
        "{space}": "␣",
        "{left}": "⇦",
        "{right}": "⇨",
        "{symbols}": "=/#",
        "{abc}": "ABC",
        "{ok}": "OK",
        "{return}": "Готово"
    };

    useEffect(() => {
        if (symbols) {
            setLayout(shift ? "shiftSymbols" : "symbols");
        } else if (language === "english") {
            setLayout(shift ? "shiftEnglish" : "english");
        } else {
            setLayout(shift ? "shiftRussian" : "russian");
        }
    }, [language, shift, symbols]);

    return (
        <SimpleKeyboard
            layoutName={layout}
            theme={"hg-theme-default symformerKeyboard"}
            layout={layouts}
            display={display}
            onKeyPress={onKeyPress}
            newLineOnEnter
            {...rest}
        />
    );
};
