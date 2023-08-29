const {normalizeURL, getURLsFromHTML} = require('./crawl.js');
const {test, expect} = require('@jest/globals');

// https://boot.dev  ->  boot.dev
// http://boot.dev   ->  boot.dev
// https://Boot.dev  ->  boot.dev
// http://Boot.dev   ->  boot.dev

test('normalizeURL strip protocol', ()=>{
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
});

test('normalizeURL trailing slash', ()=>{
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
});

test('normalizeURL capital', ()=>{
    const input = 'https://BLOG.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
});

test('normalizeURL strip http', ()=>{
    const input = 'http://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
});

test('getURLsFromHTML absolute', ()=>{
    const inputHTMLbody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path/">
                boot.dev Blog
            </a>
        </body>
    </html>`;
    const inputBaseURL = 'https://blog.boot.dev/path/';
    const actual = getURLsFromHTML(inputHTMLbody, inputBaseURL);
    const expected = ["https://blog.boot.dev/path/"]
    expect(actual).toEqual(expected)
});

test('getURLsFromHTML relative', ()=>{
    const inputHTMLbody = `
    <html>
        <body>
            <a href="/path/">
                boot.dev Blog
            </a>
        </body>
    </html>`;
    const inputBaseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(inputHTMLbody, inputBaseURL);
    const expected = ["https://blog.boot.dev/path/"];
    expect(actual).toEqual(expected);
});

test('getURLsFromHTML both', ()=>{
    const inputHTMLbody = `
    <html>
        <body>
            <a href="https://blog.boot.dev/path1/">
                boot.dev Blog Path one
            </a>
            <a href="/path2/">
                boot.dev Blog Path two
            </a>
        </body>
    </html>`;
    const inputBaseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(inputHTMLbody, inputBaseURL);
    const expected = ["https://blog.boot.dev/path1/", "https://blog.boot.dev/path2/"];
    expect(actual).toEqual(expected);
});

test('getURLsFromHTML invalid', ()=>{
    const inputHTMLbody = `
    <html>
        <body>
            <a href="invalid">
                Invalid
            </a>
        </body>
    </html>`;
    const inputBaseURL = 'https://blog.boot.dev';
    const actual = getURLsFromHTML(inputHTMLbody, inputBaseURL);
    const expected = [];
    expect(actual).toEqual(expected);
});