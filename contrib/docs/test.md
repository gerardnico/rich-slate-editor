# Test

## How does a specific test looks like?

* We use the [slate hyperscript](slate-hyperscript.md) to define and editor and its tree (ie state) with Jsx
* We apply the function
* We get back the tree
* We make a diff with the expected tree

## Directory and examples

Check the [test directory](../../__test__/) to see tests file by plugin

## Jsdom

Jsdom cannot be used on
`contenteditable`: [JSDOM does not support contenteditable](https://github.com/jsdom/jsdom/issues/1670)
