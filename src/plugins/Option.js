import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useState, useEffect, useRef } from "react";
import { $wrapNodes } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $isRangeSelection, $createParagraphNode } from "lexical";
import { $getSelection } from "lexical";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";

export function Option(props) {
  const [editor] = useLexicalComposerContext();
  const [word, setWord] = useState();
  const [finalWord, setFinalWord] = useState();
  const toolbarRef = useRef(null);
  const [blockType, setBlockType] = useState("");
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] =
    useState(false);
  function BlockOptionsDropdownList({
    editor,
    blockType,
    toolbarRef,
    setShowBlockOptionsDropDown,
  }) {
    const dropDownRef = useRef(null);

    useEffect(() => {
      const toolbar = toolbarRef.current;
      const dropDown = dropDownRef.current;

      if (toolbar !== null && dropDown !== null) {
        const { top, left } = toolbar.getBoundingClientRect();
        dropDown.style.top = `${top + 40}px`;
        dropDown.style.left = `${left}px`;
      }
    }, [dropDownRef, toolbarRef]);

    useEffect(() => {
      const dropDown = dropDownRef.current;
      const toolbar = toolbarRef.current;

      if (dropDown !== null && toolbar !== null) {
        const handle = (event) => {
          const target = event.target;

          if (!dropDown.contains(target) && !toolbar.contains(target)) {
            setShowBlockOptionsDropDown(false);
          }
        };
        document.addEventListener("click", handle);

        return () => {
          document.removeEventListener("click", handle);
        };
      }
    }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

    const formatParagraph = () => {
      if (blockType !== "paragraph") {
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            $wrapNodes(selection, () => $createParagraphNode());
          }
        });
      }
      setShowBlockOptionsDropDown(false);
    };

    const formatLargeHeading = () => {
      if (blockType !== "h1") {
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            $wrapNodes(selection, () => $createHeadingNode("h1"));
          }
        });
      }
      setShowBlockOptionsDropDown(false);
    };

    const formatSmallHeading = () => {
      if (blockType !== "h2") {
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            $wrapNodes(selection, () => $createHeadingNode("h2"));
          }
        });
      }
      setShowBlockOptionsDropDown(false);
    };
    const formatQuote = () => {
      if (blockType !== "quote") {
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            $wrapNodes(selection, () => $createQuoteNode());
          }
        });
      }
      setShowBlockOptionsDropDown(false);
    };
    return word && props.text !== "/" ? (
      <div className="dropdown" ref={dropDownRef}>
        {finalWord === "paragraph" ? (
          <button className="item" onClick={formatParagraph}>
            <span className="icon paragraph" />
            <span className="text">Normal</span>
            {blockType === "paragraph" && <span className="active" />}
          </button>
        ) : (
          <></>
        )}
        {finalWord === "heading" ? (
          <>
            <button className="item" onClick={formatLargeHeading}>
              <span className="icon large-heading" />
              <span className="text">Large Heading</span>
              {blockType === "h1" && <span className="active" />}
            </button>
            <button className="item" onClick={formatSmallHeading}>
              <span className="icon small-heading" />
              <span className="text">Small Heading</span>
              {blockType === "h2" && <span className="active" />}
            </button>{" "}
          </>
        ) : (
          <></>
        )}
        {finalWord === "quote" ? (
          <button className="item" onClick={formatQuote}>
            <span className="icon quote" />
            <span className="text">Quote</span>
            {blockType === "quote" && <span className="active" />}
          </button>
        ) : (
          <></>
        )}
      </div>
    ) : props.text === "/" || (word === undefined && props.text.length > 1) ? (
      <div className="dropdown" ref={dropDownRef}>
        <button className="item" onClick={formatLargeHeading}>
          <span className="icon large-heading" />
          <span className="text">Large Heading</span>
          {blockType === "h1" && <span className="active" />}
        </button>
        <button className="item" onClick={formatSmallHeading}>
          <span className="icon small-heading" />
          <span className="text">Small Heading</span>
          {blockType === "h2" && <span className="active" />}
        </button>
        <button className="item" onClick={formatQuote}>
          <span className="icon quote" />
          <span className="text">Quote</span>
          {blockType === "quote" && <span className="active" />}
        </button>
        <button className="item" onClick={formatParagraph}>
          <span className="icon paragraph" />
          <span className="text">Normal</span>
          {blockType === "paragraph" && <span className="active" />}
        </button>
      </div>
    ) : (
      <></>
    );
  }
  useEffect(() => {
    if (word) {
      if ("normal".includes(word)) {
        setFinalWord("paragraph");
      } else if ("heading".includes(word)) {
        setFinalWord("heading");
      } else if ("quote".includes(word)) {
        setFinalWord("quote");
      }
    }
  }, [word]);
  useEffect(() => {
    setWord(props.search);
  });
  return (
    <>
      {word && props.text === "" ? (
        <></>
      ) : (
        <BlockOptionsDropdownList
          editor={editor}
          blockType={blockType}
          toolbarRef={toolbarRef}
          setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
        />
      )}

      <HistoryPlugin />
    </>
  );
}
