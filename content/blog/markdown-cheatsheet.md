---
title: "Markdown Cheatsheet"
date: 2019-08-04T21:53:04-03:00
draft: true
---


A test post to see if the new blog is working, also handy for checking out themes.
You really want to look at the source for this page.

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5

---
# Basic Formatting
Hugo uses [Github Flavoured Markdown](https://help.github.com/categories/writing-on-github/).

* `*This is italic*` *This is italic*
* `**this is bold**` **this is bold**
* `***this is bold-italic***` ***this is bold-italic***
* `~~this is strikethrough~~` ~~this is strikethrough~~

You can do a [link](https://github.com/philipdaniels) like this: `[link](https://github.com/philipdaniels)`

You can comment stuff out like this (note you may have to separate the `{{` sigil:

    <!--
    [Link to another post]({ {< ref "post/2016/windows-vm-setup/index.md" >}})
    [Link to a heading]({ {< relref "#my-normalized-heading" >}}).
    -->

The horizontal rule is made with 3 or more dashes.

---
# Images

See [content organization](https://gohugo.io/content-management/organization/).

##### Images in the same folder as the post
An image link is created by putting an exclamation mark before the link such
as `![house](../house.gif)`

![house](/media/2018-07-07-005922.png)

The `..` is needed because in the final site, the post's `index.html` file is one
folder below the images (this is due to '.html' elimination from the URLs).

##### Images for a post in their own subfolder

The above observations lead us to a solution. Create a disk structure like this:

```
hugo-cheatsheet.md                  (the post)
hugo-cheatsheet/                    (a directory with the same name as the post)
hugo-cheatsheet/image1.gif          (one or more images)
hugo-cheatsheet/celtic-knot.jpg
```

And then in the post file `hugo-cheatsheet.md` you can link to an image like this

    ![Celtic knot](/media/2018-07-07-005922.png)

![Celtic knot](/media/2018-07-07-005922.png)

You will end up with this disk structure in your `public` folder:

```
blog\2019\hugo-cheatsheet                   (directory for the post)
blog\2019\hugo-cheatsheet\index.html        (the body of the post)
blog\2019\hugo-cheatsheet\image1.gif        (the images)
blog\2019\hugo-cheatsheet\celtic-knot.jpg
```

Links in `index.html` will be relative:

    <img src="/media/2018-07-07-005922.png" alt="Celtic knot" />

Which means you can move the website around without any problems.

You can also use the [figure shortcode](https://gohugo.io/content-management/shortcodes/),
which allows you to set the caption and/or title.

{{< figure src="/media/2018-07-07-005922.png" caption="A Celtic Knot" >}}


---
# Syntax Highlighting

{{< highlight rust "hl_lines=2 6-7" >}}
fn main() -> Result<(), io::Error> {
    // This is done with a 'highlight' short code and includes highlights of lines 2 and 6-7.
    let x = 3;
    println!("Hello {}", x);

    let x = vec![1,2,3];
    let max = x.iter().max();
}
{{< /highlight >}}


```rust
static Main() -> Result<(), io::Error> {
    // This is done with a code fence.
    let x = 3;
}
```

Both of these are done with highlight.js because Hugo's built in syntax highlighting
doesn't seem to work reliably (wraps line when it shouldn't, doesn't select the
correct theme...). See config.toml for some highlight.js parameters.

---
# Raw HTML
You can <b>just add raw</b> HTML markup straight into the markdown file.


---
# More Formatting

> This is a quote

> Can be on more than one line

Use 4 spaces to create pre-formatted text:

    $ some example text with <b> tags </b>

---
# Lists and Tables
A list is created using asterisks or dashes

* First
* Second
* Third

Nested and numeric lists are possible

1. First
  * Sub 1
  * Sub 2
2. Second
  * Sub 1
  * Sub 2

Another example

1. Make my changes
  1. Fix bug
  2. Improve formatting
     * Make the headings bigger
2. Push my commits to GitHub
3. Open a pull request
  * Describe my changes
  * Mention all the members of my team
     * Ask for feedback



Tables work (note the escaping of the '|' character):

| Column Header  | Another header | Right-aligned |
| -------------  | -------------- |          ---: |
| Some text      | more **text**  | 10            |
| something else | more else \| < pipe  | 20      |

---
# Hugo Commands
- New blog post (draft): `hugo new blog/2019/my-title.md`
- Serve (with drafts): `hugo server -D`
- Serve with particular theme: `hugo server --theme=my-theme`
- Build it: `hugo`

---
# Theme Customization
(TODO: This is out of date)

[Theme customization](https://gohugo.io/themes/customizing/) is achieved by
dropping a custom file in a path in the main directory that corresponds to the
path in the theme directory; typically the templates constituting the theme will
have includes of the partial already. For example, I have customized Greyshade
by creating files in `blog/layouts/partials/custom` that correspond to the files
in `themes/hugo-greyshade/layouts/partials/custom`. I have achieved CSS
customization by creating `static/css/pd.css` with some override styles.