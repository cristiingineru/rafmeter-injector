# About
Adds instrumentation to a bunch of html pages for measuring the raf/fps.


# How it works
It looks up in all the files described with a glob pattern and if not already present adds a small raf/fps meter at the beginning of each file. The instrumentation being injected is here: [rafmeter](https://github.com/cristiingineru/rafmeter)


# Usage
Install it globally:
```
npm install rafmeter-injector -g
```

Run it with a glob pattern argument:
```
rafmeter-injector 'path/to/my/app/**/*.html'
```

Specifying the ```html``` extension in the lookup pattern is important.

Be default the files under ```node_modules``` folders are being excluded. Multiple custom exclusions can be specified after the lookup pattern:

```
rafmeter-injector 'path/to/search/*.html' '**/exclude/bin/folder**' 'excludeFile.html' 'excludeAnotherFile.html'
```
