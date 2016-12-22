/*
 * testHTMLTemplateFile.js - test the HTML template file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

var path = require("path");
var fs = require("fs");

if (!HTMLTemplateFile) {
    var HTMLTemplateFile = require("../lib/HTMLTemplateFile.js");

    var WebProject =  require("../lib/WebProject.js");
    var TranslationSet =  require("../lib/TranslationSet.js");
    var ResourceString =  require("../lib/ResourceString.js");
}

function diff(a, b) {
	var min = Math.min(a.length, b.length);
	
	for (var i = 0; i < min; i++) {
		if (a[i] !== b[i]) {
			console.log("Found difference at character " + i);
			console.log("a: " + a.substring(i));
			console.log("b: " + b.substring(i));
			break;
		}
	}
}

module.exports = {
    testHTMLTemplateFileConstructor: function(test) {
        test.expect(1);

        var htf = new HTMLTemplateFile();
        test.ok(htf);
        
        test.done();
    },
    
    testHTMLTemplateFileConstructorParams: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p, "./testfiles/tmpl/CookieFlowConciergeTemplate.tmpl.html");
        
        test.ok(htf);
        
        test.done();
    },

    testHTMLTemplateFileConstructorNoFile: function(test) {
        test.expect(1);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        test.done();
    },

    testHTMLTemplateFileMakeKey: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        test.equal(htf.makeKey("This is a test"), "This is a test");
        
        test.done();
    },

    testHTMLTemplateFileMakeKeyNoReturnChars: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        test.equal(htf.makeKey("This is\n a te\nst"), "This is a test");
        
        test.done();
    },

    testHTMLTemplateFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html><body>This is a test</body></html>');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.get(ResourceString.hashKey(undefined, "en-US", "This is a test"));
        test.ok(r);
        
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        test.done();
    },

    testHTMLTemplateFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html><body>This is a test</body></html>');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        test.done();
    },

    testHTMLTemplateFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' + 
        		'<body>\n' +
        		'     This is a test    \n' +
        		'</body>\n' + 
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        test.done();
    },

    testHTMLTemplateFileParseDontExtractUnicodeWhitespace: function(test) {
        test.expect(3);

        var p = new WebProject({
        	name: "foo",
        	id: "foo",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        // contains U+00A0 non-breaking space and other Unicode space characters
        htf.parse('<div>            ​‌‍ ⁠⁡⁢⁣⁤</div>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        test.equal(set.size(), 0);
        
        test.done();
    },

    testHTMLTemplateFileParseDontExtractNbspEntity: function(test) {
        test.expect(3);

        var p = new WebProject({
        	name: "foo",
        	id: "foo",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<div>&nbsp; &nnbsp; &mmsp;</div>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        test.equal(set.size(), 0);
        
        test.done();
    },

    testHTMLTemplateFileParseDoExtractOtherEntities: function(test) {
        test.expect(3);

        var p = new WebProject({
        	name: "foo",
        	id: "foo",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<div>&uuml;</div>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testHTMLTemplateFileParseNoStrings: function(test) {
        test.expect(3);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<div class="noheader medrx"></div>');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 0);
        
        test.done();
    },

    testHTMLTemplateFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);

        var set = htf.getTranslationSet();
        test.equal(set.size(), 0);

        htf.parse('<html><body>This is a test</body></html>');
        
        test.ok(set);
        
        test.equal(set.size(), 1);
        
        test.done();
    },

    testHTMLTemplateFileParseMultiple: function(test) {
        test.expect(8);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is a test\n' +
        		'       <div id="foo">\n' + 
        		'           This is also a test\n' +
        		'       </div>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "This is also a test");
        
        test.done();
    },

    testHTMLTemplateFileParseWithDups: function(test) {
        test.expect(6);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is a test\n' +
        		'       <div id="foo">\n' + 
        		'           This is also a test\n' +
        		'       </div>\n' +
        		'       This is a test\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        test.equal(set.size(), 2);
        
        test.done();
    },

    testHTMLTemplateFileParseEscapeInvalidChars: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <div id="foo">\n' + 
        		'           This is also a \u0003 test\n' +
        		'       </div>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        // should use html entities to represent the invalid control chars
        var r = set.getBySource("This is also a &#3; test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a &#3; test");
        test.equal(r.getKey(), "This is also a &#3; test");
        
        test.done();
    },

    testHTMLTemplateFileParseDontEscapeWhitespaceChars: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <div id="foo">\n' + 
        		'           This is also a \u000C test\n' +
        		'       </div>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        // leave the whitespace control chars alone
        var r = set.getBySource("This is also a \u000C test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a \u000C test");
        test.equal(r.getKey(), "This is also a \u000C test");
        
        test.done();
    },

    testHTMLTemplateFileSkipScript: function(test) {
        test.expect(8);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <head>\n' + 
        		'   <script>\n' +
        		'// comment text\n' +
        		'if (locales.contains[thisLocale]) {\n' +
        		'	document.write("<input id=\"locale\" class=\"foo\" title=\"bar\"></input>");\n' +
        		'}\n' +
        		'   </head>\n' + 
        		'   </script>\n' + 
        		'   <body>\n' + 
        		'       This is a test\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        var r = set.getBySource("// comment text");
        test.ok(!r);
        
        var r = set.getBySource("bar");
        test.ok(!r);
        
        test.equal(set.size(), 1);
        
        test.done();
    },
    
    testHTMLTemplateFileParseNonBreakingTags: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is a <em>test</em> of the emergency parsing system.  \n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a <em>test</em> of the emergency parsing system.");
        test.ok(r);
        test.equal(r.getSource(), "This is a <em>test</em> of the emergency parsing system.");
        test.equal(r.getKey(), "This is a <em>test</em> of the emergency parsing system.");
                
        test.done();
    },

    testHTMLTemplateFileParseNonBreakingTagsOutside: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <span id="foo" class="bar">  This is a test of the emergency parsing system.  </span>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        // should not pick up the span tag because there is no localizable text
        // before it or after it
        var r = set.getBySource("This is a test of the emergency parsing system.");
        test.ok(r);
        test.equal(r.getSource(), "This is a test of the emergency parsing system.");
        test.equal(r.getKey(), "This is a test of the emergency parsing system.");
                
        test.done();
    },

    testHTMLTemplateFileParseNonBreakingTagsInside: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        // should pick up the span tag because there is localizable text
        // before it and after it
        var r = set.getBySource('This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.');
        test.ok(r);
        test.equal(r.getSource(), 'This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.');
        test.equal(r.getKey(), 'This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.');
                
        test.done();
    },

    testHTMLTemplateFileParseNonBreakingTagsInsideMultiple: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        // tags should be nestable
        var r = set.getBySource('This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.');
        test.ok(r);
        test.equal(r.getSource(), 'This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.');
        test.equal(r.getKey(), 'This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.');
                
        test.done();
    },

    testHTMLTemplateFileParseNonBreakingTagsNotWellFormed: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        // the end span tag should automatically end the em tag
        var r = set.getBySource('This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.');
        test.ok(r);
        test.equal(r.getSource(), 'This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.');
        test.equal(r.getKey(), 'This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.');
                
        test.done();
    },

    testHTMLTemplateFileParseNonBreakingTagsNotWellFormedWithTerminatorTag: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <div>This is <span id="foo" class="bar"> a test of the <em>emergency parsing </div> system.\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        // the end div tag ends all the other tags
        var r = set.getBySource('This is <span id="foo" class="bar"> a test of the <em>emergency parsing');
        test.ok(r);
        test.equal(r.getSource(), 'This is <span id="foo" class="bar"> a test of the <em>emergency parsing');
        test.equal(r.getKey(), 'This is <span id="foo" class="bar"> a test of the <em>emergency parsing');
                
        test.done();
    },

    testHTMLTemplateFileParseNonBreakingTagsTagStackIsReset: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <div>This is <span id="foo" class="bar"> a test of the <em>emergency parsing</em> system.</div>\n' +
        		'       <div>This is <b>another test</b> of the emergency parsing </span> system.</div>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        // the end div tag ends all the other tags
        var r = set.getBySource('This is <b>another test</b> of the emergency parsing');
        test.ok(r);
        test.equal(r.getSource(), 'This is <b>another test</b> of the emergency parsing');
        test.equal(r.getKey(), 'This is <b>another test</b> of the emergency parsing');
                
        test.done();
    },

    testHTMLTemplateFileParseLocalizableTitle: function(test) {
        test.expect(8);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <div title="This value is localizable">\n' + 
        		'           This is a test\n' +
        		'       </div>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        r = set.getBySource("This value is localizable");
        test.ok(r);
        test.equal(r.getSource(), "This value is localizable");
        test.equal(r.getKey(), "This value is localizable");
        
        test.done();
    },

    testHTMLTemplateFileParseLocalizableAttributes: function(test) {
        test.expect(11);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <img src="http://www.test.test/foo.png" alt="Alternate text">\n' + 
        		'       This is a test\n' +
        		'       <input type="text" placeholder="localizable placeholder here">\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
        
        r = set.getBySource("Alternate text");
        test.ok(r);
        test.equal(r.getSource(), "Alternate text");
        test.equal(r.getKey(), "Alternate text");
        
        r = set.getBySource("localizable placeholder here");
        test.ok(r);
        test.equal(r.getSource(), "localizable placeholder here");
        test.equal(r.getKey(), "localizable placeholder here");
        
        test.done();
    },

    testHTMLTemplateFileParseLocalizableAttributesSkipEmpty: function(test) {
        test.expect(6);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <img src="http://www.test.test/foo.png" alt="">\n' + 
        		'       This is a test\n' +
        		'       <input type="text" placeholder="">\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        test.equal(set.size(), 1);
        
        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "This is a test");
                
        test.done();
    },

    testHTMLTemplateFileParseLocalizableAttributesAndNonBreakingTags: function(test) {
        test.expect(8);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is <a href="foo.html" title="localizable title">a test</a> of non-breaking tags.\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource('This is <a href="foo.html" title="{title}">a test</a> of non-breaking tags.');
        test.ok(r);
        test.equal(r.getSource(), 'This is <a href="foo.html" title="{title}">a test</a> of non-breaking tags.');
        test.equal(r.getKey(), 'This is <a href="foo.html" title="{title}">a test</a> of non-breaking tags.');
        
        r = set.getBySource("localizable title");
        test.ok(r);
        test.equal(r.getSource(), "localizable title");
        test.equal(r.getKey(), "localizable title");
        
        test.done();
    },

    testHTMLTemplateFileParseBreakBetweenTemplateTags: function(test) {
        test.expect(8);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <% if(doctor){ %>\n' +
                '           Consult\n' +
                '       <% } else { %>\n' +
                '           Get doctor answers for free!\n' +
                '       <% } %>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource('Consult');
        test.ok(r);
        test.equal(r.getSource(), 'Consult');
        test.equal(r.getKey(), 'Consult');
        
        r = set.getBySource("Get doctor answers for free!");
        test.ok(r);
        test.equal(r.getSource(), "Get doctor answers for free!");
        test.equal(r.getKey(), "Get doctor answers for free!");
        
        test.done();
    },

    testHTMLTemplateFileParseDontBreakBetweenTemplateEchoTags: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       Dr. <%= family_name %> is not available.\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource('Dr. <%= family_name %> is not available.');
        test.ok(r);
        test.equal(r.getSource(), 'Dr. <%= family_name %> is not available.');
        test.equal(r.getKey(), 'Dr. <%= family_name %> is not available.');
                
        test.done();
    },

    testHTMLTemplateFileParseTemplateTagsInsideTags: function(test) {
        test.expect(5);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <span <% if (condition) { %>class="foo"<% } %>> Dr. <%= family_name %> is not available.</span>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource('Dr. <%= family_name %> is not available.');
        test.ok(r);
        test.equal(r.getSource(), 'Dr. <%= family_name %> is not available.');
        test.equal(r.getKey(), 'Dr. <%= family_name %> is not available.');
                
        test.done();
    },

    testHTMLTemplateFileParseI18NComments: function(test) {
        test.expect(6);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' +
        		'       <!-- i18n: this describes the text below -->\n' +
        		'       This is a test of the emergency parsing system.  \n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("This is a test of the emergency parsing system.");
        test.ok(r);
        test.equal(r.getSource(), "This is a test of the emergency parsing system.");
        test.equal(r.getKey(), "This is a test of the emergency parsing system.");
        test.equal(r.getComment(), "this describes the text below");
                
        test.done();
    },
    
    testHTMLTemplateFileParseIgnoreTags: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html><body>\n' +
        	'<script type="javascript">\n' +
        	'if (window) {\n' +
        	'  $(".foo").class("asdf");\n' +
        	'}\n' +
        	'</script>\n' +
        	'<style>\n' +
        	'  .activity_title{\n' +
        	'    font-size: 18px;\n' +
        	'    font-weight: 300;\n' +
        	'    color: #777;\n' +
        	'    line-height: 40px;\n' +
        	'  }\n' +
        	'</style>\n' +
        	'<span class="foo">foo</span>\n' + 
        	'</body></html>');
        
        var set = htf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        
        var r = set.getBySource("foo");
        test.ok(r);
        test.equal(r.getSource(), "foo");
        test.equal(r.getKey(), "foo");

        test.done();
    },

    testHTMLTemplateFileExtractFile: function(test) {
        test.expect(17);

        var base = path.dirname(module.id);
        
        var p = new WebProject({
        	sourceLocale: "en-US"
        }, path.join(base, "testfiles"));
        
        var htf = new HTMLTemplateFile(p, "./tmpl/CookieFlowConciergeTemplate.tmpl.html");
        test.ok(htf);
        
        // should read the file
        htf.extract();
        
        var set = htf.getTranslationSet();
        
        test.equal(set.size(), 4);
        
        var r = set.getBySource("Get doctor answers for free!");
        test.ok(r);
        test.equal(r.getSource(), "Get doctor answers for free!");
        test.equal(r.getKey(), "Get doctor answers for free!");
       
        r = set.getBySource("Consult");
        test.ok(r);
        test.equal(r.getSource(), "Consult");
        test.equal(r.getKey(), "Consult");

        r = set.getBySource("Send question");
        test.ok(r);
        test.equal(r.getSource(), "Send question");
        test.equal(r.getKey(), "Send question");

        r = set.getBySource("Ask");
        test.ok(r);
        test.equal(r.getSource(), "Ask");
        test.equal(r.getKey(), "Ask");

        r = set.getBySource("Ask");
        test.ok(r);
        test.equal(r.getSource(), "Ask");
        test.equal(r.getKey(), "Ask");

        test.done();
    },

    testHTMLTemplateFileExtractFile2: function(test) {
        test.expect(14);

        var base = path.dirname(module.id);
        
        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, path.join(base, "testfiles"));
        
        var htf = new HTMLTemplateFile(p, "./tmpl/topic_navigation_main.tmpl.html");
        test.ok(htf);
        
        // should read the file
        htf.extract();
        
        var set = htf.getTranslationSet();
        
        test.equal(set.size(), 4);
        
        var r = set.getBySource("Description");
        test.ok(r);
        test.equal(r.getSource(), "Description");
        test.equal(r.getKey(), "Description");
       
        r = set.getBySource('Authored by <a class="actor_link bold" href="#expert_vip/<%=val.author.id%>/"><%=val.author.full_name%></a>');
        test.ok(r);
        test.equal(r.getSource(), 'Authored by <a class="actor_link bold" href="#expert_vip/<%=val.author.id%>/"><%=val.author.full_name%></a>');
        test.equal(r.getKey(), 'Authored by <a class="actor_link bold" href="#expert_vip/<%=val.author.id%>/"><%=val.author.full_name%></a>');

        r = set.getBySource('and <a class="bold"><span class="doc_agree_count_h"><%=val.desc_agrees.length%></span> doctor<%=val.desc_agrees.length> 1 ? \'s\' : \'\'%> agree</a>');
        test.ok(r);
        test.equal(r.getSource(), 'and <a class="bold"><span class="doc_agree_count_h"><%=val.desc_agrees.length%></span> doctor<%=val.desc_agrees.length> 1 ? \'s\' : \'\'%> agree</a>');
        test.equal(r.getKey(), 'and <a class="bold"><span class="doc_agree_count_h"><%=val.desc_agrees.length%></span> doctor<%=val.desc_agrees.length> 1 ? \'s\' : \'\'%> agree</a>');

        r = set.getBySource("Write a better description &raquo;");
        test.ok(r);
        test.equal(r.getSource(), "Write a better description &raquo;");
        test.equal(r.getKey(), "Write a better description &raquo;");

        test.done();
    },

    testHTMLTemplateFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);
        
        var p = new WebProject({
        	sourceLocale: "en-US"
        }, path.join(base, "testfiles"));
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        // should attempt to read the file and not fail
        htf.extract();
        
        var set = htf.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testHTMLTemplateFileExtractBogusFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);
        
        var p = new WebProject({
        	sourceLocale: "en-US"
        }, path.join(base, "testfiles"));
        
        var htf = new HTMLTemplateFile(p, "./tmpl/bogus.tmpl.html");
        test.ok(htf);
        
        // should attempt to read the file and not fail
        htf.extract();
        
        var set = htf.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testHTMLTemplateFileLocalizeText: function(test) {
        test.expect(2);

        var p = new WebProject({
        	name: "foo",
        	id: "foo",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html><body>This is a test</body></html>\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: "This is a test",
        	source: "Ceci est un essai",
        	locale: "fr-FR"
        }));
        
        test.equal(htf.localizeText(translations, "fr-FR"),
    		'<html><body>Ceci est un essai</body></html>\n');
        
        test.done();
    },

    testHTMLTemplateFileLocalizeTextPreserveWhitespace: function(test) {
        test.expect(2);

        var p = new WebProject({
        	name: "foo",
        	id: "foo",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' + 
        		'<body>\n' +
        		'     This is a test    \n' +
        		'</body>\n' + 
        		'</html>\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: "This is a test",
        	source: "Ceci est un essai",
        	locale: "fr-FR"
        }));
        
        test.equal(htf.localizeText(translations, "fr-FR"),
    		'<html>\n' + 
    		'<body>\n' +
    		'     Ceci est un essai    \n' +
    		'</body>\n' + 
    		'</html>\n');
        
        test.done();
    },

    testHTMLTemplateFileLocalizeTextMultiple: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is a test\n' +
        		'       <div id="foo">\n' + 
        		'           This is also a test\n' +
        		'       </div>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: "This is a test",
        	source: "Ceci est un essai",
        	locale: "fr-FR"
        }));
        translations.add(new ResourceString({
        	project: "foo",
        	key: "This is also a test",
        	source: "Ceci est aussi un essai",
        	locale: "fr-FR"
        }));
        
        test.equal(htf.localizeText(translations, "fr-FR"),
        		'<html>\n' +
        		'   <body>\n' + 
        		'       Ceci est un essai\n' +
        		'       <div id="foo">\n' + 
        		'           Ceci est aussi un essai\n' +
        		'       </div>\n' +
        		'   </body>\n' +
        		'</html>\n');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextWithDups: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is a test\n' +
        		'       <div id="foo">\n' + 
        		'           This is also a test\n' +
        		'       </div>\n' +
        		'       This is a test\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: "This is a test",
        	source: "Ceci est un essai",
        	locale: "fr-FR"
        }));
        translations.add(new ResourceString({
        	project: "foo",
        	key: "This is also a test",
        	source: "Ceci est aussi un essai",
        	locale: "fr-FR"
        }));
        
        test.equal(htf.localizeText(translations, "fr-FR"),
        		'<html>\n' +
        		'   <body>\n' + 
        		'       Ceci est un essai\n' +
        		'       <div id="foo">\n' + 
        		'           Ceci est aussi un essai\n' +
        		'       </div>\n' +
        		'       Ceci est un essai\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        test.done();
    },

    testHTMLTemplateFileSkipScript: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <head>\n' + 
        		'   <script>\n' +
        		'// comment text\n' +
        		'if (locales.contains[thisLocale]) {\n' +
        		'	document.write("<input id=\"locale\" class=\"foo\" title=\"bar\"></input>");\n' +
        		'}\n' +
        		'   </head>\n' + 
        		'   </script>\n' + 
        		'   <body>\n' + 
        		'       This is a test\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: "This is a test",
        	source: "Ceci est un essai",
        	locale: "fr-FR"
        }));
        
        test.equal(htf.localizeText(translations, "fr-FR"),
    		'<html>\n' +
    		'   <head>\n' + 
    		'   <script>\n' +
    		'// comment text\n' +
    		'if (locales.contains[thisLocale]) {\n' +
    		'	document.write("<input id=\"locale\" class=\"foo\" title=\"bar\"></input>");\n' +
    		'}\n' +
    		'   </head>\n' + 
    		'   </script>\n' + 
    		'   <body>\n' + 
    		'       Ceci est un essai\n' +
    		'   </body>\n' +
    		'</html>\n');
        
        test.done();
    },
    
    testHTMLTemplateFileLocalizeTextNonBreakingTags: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is a <em>test</em> of the emergency parsing system.  \n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: "This is a <em>test</em> of the emergency parsing system.",
        	source: "Ceci est un <em>essai</em> du système d'analyse syntaxique de l'urgence.",
        	locale: "fr-FR"
        }));
        
        test.equal(htf.localizeText(translations, "fr-FR"),
    		'<html>\n' +
    		'   <body>\n' + 
    		'       Ceci est un <em>essai</em> du système d\'analyse syntaxique de l\'urgence.  \n' +
    		'   </body>\n' +
    		'</html>\n');
                
        test.done();
    },

    testHTMLTemplateFileLocalizeTextNonBreakingTagsOutside: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <span id="foo" class="bar">  This is a test of the emergency parsing system.  </span>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: "This is a test of the emergency parsing system.",
        	source: "Ceci est un essai du système d'analyse syntaxique de l'urgence.",
        	locale: "fr-FR"
        }));
        
        test.equal(htf.localizeText(translations, "fr-FR"),
    		'<html>\n' +
    		'   <body>\n' + 
    		'       <span id="foo" class="bar">  Ceci est un essai du système d\'analyse syntaxique de l\'urgence.  </span>\n' +
    		'   </body>\n' +
    		'</html>\n');
                
        test.done();
    },

    testHTMLTemplateFileLocalizeTextNonBreakingTagsInside: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.',
        	source: 'Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de l\'urgence.</span>',
        	locale: "fr-FR"
        }));
        
        test.equal(htf.localizeText(translations, "fr-FR"),
    		'<html>\n' +
    		'   <body>\n' + 
    		'       Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de l\'urgence.</span>\n' +
    		'   </body>\n' +
    		'</html>\n');
                
        test.done();
    },

    testHTMLTemplateFileLocalizeTextNonBreakingTagsInsideMultiple: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.',
        	source: 'Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence</em>.</span>',
        	locale: "fr-FR"
        }));
        
        test.equal(htf.localizeText(translations, "fr-FR"),
    		'<html>\n' +
    		'   <body>\n' + 
    		'       Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence</em>.</span>\n' +
    		'   </body>\n' +
    		'</html>\n');
                
        test.done();
    },

    testHTMLTemplateFileLocalizeTextNonBreakingTagsNotWellFormed: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.',
        	source: 'Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence.</span>',
        	locale: "fr-FR"
        }));
        
        test.equal(htf.localizeText(translations, "fr-FR"),
        		'<html>\n' +
        		'   <body>\n' + 
        		'       Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence.</span>\n' +
        		'   </body>\n' +
        		'</html>\n');
                
        test.done();
    },

    testHTMLTemplateFileLocalizeTextNonBreakingTagsNotWellFormedWithTerminatorTag: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <div>This is <span id="foo" class="bar"> a test of the <em>emergency parsing </div> system.\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'This is <span id="foo" class="bar"> a test of the <em>emergency parsing',
        	source: 'Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique',
        	locale: "fr-FR"
        }));
        
        test.equal(htf.localizeText(translations, "fr-FR"),
        		'<html>\n' +
        		'   <body>\n' + 
        		'       <div>Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique </div> system.\n' +
        		'   </body>\n' +
        		'</html>\n');
                
        test.done();
    },

    testHTMLTemplateFileLocalizeTextLocalizableTitle: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <div title="This value is localizable">\n' + 
        		'           This is a test\n' +
        		'       </div>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'This value is localizable',
        	source: 'Cette valeur est localisable',
        	locale: "fr-FR"
        }));
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'This is a test',
        	source: 'Ceci est un essai',
        	locale: "fr-FR"
        }));
        
        test.equal(htf.localizeText(translations, "fr-FR"),
        		'<html>\n' +
        		'   <body>\n' + 
        		'       <div title="Cette valeur est localisable">\n' + 
        		'           Ceci est un essai\n' +
        		'       </div>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        test.done();
    },

    testHTMLTemplateFileLocalizeTextLocalizableAttributes: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <img src="http://www.test.test/foo.png" alt="Alternate text">\n' + 
        		'       This is a test\n' +
        		'       <input type="text" placeholder="localizable placeholder here">\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'Alternate text',
        	source: 'Texte alternative',
        	locale: "fr-FR"
        }));
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'This is a test',
        	source: 'Ceci est un essai',
        	locale: "fr-FR"
        }));
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'localizable placeholder here',
        	source: 'espace réservé localisable ici',
        	locale: "fr-FR"
        }));
        
        test.equal(htf.localizeText(translations, "fr-FR"),
        		'<html>\n' +
        		'   <body>\n' + 
        		'       <img src="http://www.test.test/foo.png" alt="Texte alternative">\n' + 
        		'       Ceci est un essai\n' +
        		'       <input type="text" placeholder="espace réservé localisable ici">\n' +
        		'   </body>\n' +
        		'</html>\n');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextLocalizableAttributesAndNonBreakingTags: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       This is <a href="foo.html" title="localizable title">a test</a> of non-breaking tags.\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'This is <a href="foo.html" title="{title}">a test</a> of non-breaking tags.',
        	source: 'Ceci est <a href="foo.html" title="{title}">un essai</a> des balises non-ruptures.',
        	locale: "fr-FR"
        }));
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'localizable title',
        	source: 'titre localisable',
        	locale: "fr-FR"
        }));
        
        test.equal(htf.localizeText(translations, "fr-FR"),
        		'<html>\n' +
        		'   <body>\n' + 
        		'       Ceci est <a href="foo.html" title="titre localisable">un essai</a> des balises non-ruptures.\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        test.done();
    },

    testHTMLTemplateFileLocalizeTextBreakBetweenTemplateTags: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <% if(doctor){ %>\n' +
                '           Consult\n' +
                '       <% } else { %>\n' +
                '           Get doctor answers for free!\n' +
                '       <% } %>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'Consult',
        	source: 'Une consultation',
        	locale: "fr-FR"
        }));
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'Get doctor answers for free!',
        	source: 'Obtenez des réponses de médecins gratuitement!',
        	locale: "fr-FR"
        }));
        
        test.equal(htf.localizeText(translations, "fr-FR"),
    		'<html>\n' +
    		'   <body>\n' + 
    		'       <% if(doctor){ %>\n' +
            '           Une consultation\n' +
            '       <% } else { %>\n' +
            '           Obtenez des réponses de médecins gratuitement!\n' +
            '       <% } %>\n' +
    		'   </body>\n' +
    		'</html>\n');
        
        test.done();
    },

    testHTMLTemplateFileLocalizeTextDontBreakBetweenTemplateEchoTags: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       Dr. <%= family_name %> is not available.\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'Dr. <%= family_name %> is not available.',
        	source: 'Dr. <%= family_name %> n\'est pas disponibles.',
        	locale: "fr-FR"
        }));
             
        test.equal(htf.localizeText(translations, "fr-FR"),
        		'<html>\n' +
        		'   <body>\n' + 
        		'       Dr. <%= family_name %> n\'est pas disponibles.\n' +
        		'   </body>\n' +
        		'</html>\n');
                
        test.done();
    },

    testHTMLTemplateFileLocalizeTextI18NComments: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' +
        		'       <!-- i18n: this describes the text below -->\n' +
        		'       This is a test of the emergency parsing system.  \n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'This is a test of the emergency parsing system.',
        	source: 'Ceci est un essai du système d\'analyse syntaxique de l\'urgence.',
        	locale: "fr-FR"
        }));
                
        test.equal(htf.localizeText(translations, "fr-FR"),
        		'<html>\n' +
        		'   <body>\n' +
        		'       \n' +
        		'       Ceci est un essai du système d\'analyse syntaxique de l\'urgence.  \n' +
        		'   </body>\n' +
        		'</html>\n');
                
        test.done();
    },
    
    testHTMLTemplateFileGetLocalizedPathSimple: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p, "simple.tmpl.html");
        test.ok(htf);
        
        test.equal(htf.getLocalizedPath("fr-FR"), "testfiles/simple.fr-FR.tmpl.html");
                
        test.done();
    },

    testHTMLTemplateFileGetLocalizedPathComplex: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p, "./asdf/bar/simple.tmpl.html");
        test.ok(htf);
        
        test.equal(htf.getLocalizedPath("fr-FR"), "testfiles/asdf/bar/simple.fr-FR.tmpl.html");
                
        test.done();
    },

    testHTMLTemplateFileGetLocalizedPathRegularHTMLFileName: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p, "./asdf/bar/simple.html");
        test.ok(htf);
        
        test.equal(htf.getLocalizedPath("fr-FR"), "testfiles/asdf/bar/simple.fr-FR.html");
                
        test.done();
    },
    
    testHTMLTemplateFileGetLocalizedPathNotEnoughParts: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p, "./asdf/bar/simple");
        test.ok(htf);
        
        test.equal(htf.getLocalizedPath("fr-FR"), "testfiles/asdf/bar/simple.fr-FR");
                
        test.done();
    },
    
    testHTMLTemplateFileGetLocalizedSourceLocale: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p, "./asdf/bar/simple.en-US.tmpl.html");
        test.ok(htf);
        
        test.equal(htf.getLocalizedPath("fr-FR"), "testfiles/asdf/bar/simple.fr-FR.tmpl.html");
                
        test.done();
    },

    testHTMLTemplateFileLocalize: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);
        
        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, path.join(base, "testfiles"));
        
        var htf = new HTMLTemplateFile(p, "./tmpl/CookieFlowConciergeTemplate.tmpl.html");
        test.ok(htf);
        
        // should read the file
        htf.extract();
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'Get doctor answers for free!',
        	source: 'Obtenir des réponses de médecins gratuitement!',
        	locale: "fr-FR"
        }));
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'Consult',
        	source: 'Consultation',
        	locale: "fr-FR"
        }));
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'Ask',
        	source: 'Poser un question',
        	locale: "fr-FR"
        }));
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'Send question',
        	source: 'Envoyer la question',
        	locale: "fr-FR"
        }));
        
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'Get doctor answers for free!',
        	source: 'Kostenlosen antworten von Ärzten erhalten!',
        	locale: "de-DE"
        }));
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'Consult',
        	source: 'Beratung',
        	locale: "de-DE"
        }));
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'Ask',
        	source: 'Eine Frage stellen',
        	locale: "de-DE"
        }));
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'Send question',
        	source: 'Frage abschicken',
        	locale: "de-DE"
        }));

        htf.localize(translations, ["fr-FR", "de-DE"]);
        
        test.ok(fs.existsSync(path.join(base, "testfiles/tmpl/CookieFlowConciergeTemplate.fr-FR.tmpl.html")));
        test.ok(fs.existsSync(path.join(base, "testfiles/tmpl/CookieFlowConciergeTemplate.de-DE.tmpl.html")));
        
        var content = fs.readFileSync(path.join(base, "testfiles/tmpl/CookieFlowConciergeTemplate.fr-FR.tmpl.html"), "utf-8");
        
        var expected =
        	'<div class="upsell-ad-item clearfix">  \n' +
    		'    <div class="modal_x"></div>\n' +
    		'    <div class="upsell-ad-content">\n' +
    		'      <div class="upsell-ad-header">\n' +
    		'        <div class="caduceus-big cookie-flow"></div>\n' +
    		'        <span class="upsell-header-bold"><%=title%></span>\n' +
    		'          <% if(doctor){ %>\n' +
    		'            <%=\n' +
    		'              RB.getString(\'Consult  {span_tag_start}{value}{span_tag_end}, a {specialist_name} with {years} years in practice:\').format({\n' +
    		'                value: doctor.value,\n' +
    		'                specialist_name: doctor.specialist_name,\n' +
    		'                years: doctor.years_in_practice,\n' +
    		'                span_tag_start: \'<span class="upsell-header-bold">\',\n' +
    		'                span_tag_end: \'</span>\'\n' +
    		'              })\n' +
    		'            %>\n' +
    		'            Consultation\n' +
    		'          <% } else { %>\n' +
    		'            Obtenir des réponses de médecins gratuitement!\n' +
    		'          <% } %>\n' +
    		'      </div>\n' +
    		'      <div class="upsell-ad-wrapper" style="<%= doctor ? \'\' : \'padding-left: 0\' %>">\n' +
    		'         <% if(doctor){ %>\n' +
    		'          <a class="doctor-avatar" href="/experts/<%= doctor.id %>" style="background-image: url(<%= doctor.avatar_transparent_circular %>);"></a>\n' +
    		'        <% } %>\n' +
    		'        <input class="askInputArea-cookie desktop" maxlength="150" placeholder=\'<%= placeholder %>\'>\n' +
    		'        <span class="askSendArea-cookie">\n' +
    		'          <a class="askSendBtn-cookie" href="<%= doctor ? \'/experts/\' + doctor.id + \'/message?from_seo=1\' : \'/send_question\' %>">\n' +
    		'            <div class="desktop-btn">Envoyer la question</div>\n' +
    		'            <div class="mobile-btn">Poser un question</div>\n' +
    		'          </a>\n' +
    		'        </span>\n' +
    		'      </div>\n' +
    		'    </div>\n' +
    		'</div>';
        
        diff(content, expected);
    	test.equal(content, expected);
        
        content = fs.readFileSync(path.join(base, "testfiles/tmpl/CookieFlowConciergeTemplate.de-DE.tmpl.html"), "utf-8");
        
        test.equal(content,
    		'<div class="upsell-ad-item clearfix">  \n' +
    		'    <div class="modal_x"></div>\n' +
    		'    <div class="upsell-ad-content">\n' +
    		'      <div class="upsell-ad-header">\n' +
    		'        <div class="caduceus-big cookie-flow"></div>\n' +
    		'        <span class="upsell-header-bold"><%=title%></span>\n' +
    		'          <% if(doctor){ %>\n' +
    		'            <%=\n' +
    		'              RB.getString(\'Consult  {span_tag_start}{value}{span_tag_end}, a {specialist_name} with {years} years in practice:\').format({\n' +
    		'                value: doctor.value,\n' +
    		'                specialist_name: doctor.specialist_name,\n' +
    		'                years: doctor.years_in_practice,\n' +
    		'                span_tag_start: \'<span class="upsell-header-bold">\',\n' +
    		'                span_tag_end: \'</span>\'\n' +
    		'              })\n' +
    		'            %>\n' +
    		'            Beratung\n' +
    		'          <% } else { %>\n' +
    		'            Kostenlosen antworten von Ärzten erhalten!\n' +
    		'          <% } %>\n' +
    		'      </div>\n' +
    		'      <div class="upsell-ad-wrapper" style="<%= doctor ? \'\' : \'padding-left: 0\' %>">\n' +
    		'         <% if(doctor){ %>\n' +
    		'          <a class="doctor-avatar" href="/experts/<%= doctor.id %>" style="background-image: url(<%= doctor.avatar_transparent_circular %>);"></a>\n' +
    		'        <% } %>\n' +
    		'        <input class="askInputArea-cookie desktop" maxlength="150" placeholder=\'<%= placeholder %>\'>\n' +
    		'        <span class="askSendArea-cookie">\n' +
    		'          <a class="askSendBtn-cookie" href="<%= doctor ? \'/experts/\' + doctor.id + \'/message?from_seo=1\' : \'/send_question\' %>">\n' +
    		'            <div class="desktop-btn">Frage abschicken</div>\n' +
    		'            <div class="mobile-btn">Eine Frage stellen</div>\n' +
    		'          </a>\n' +
    		'        </span>\n' +
    		'      </div>\n' +
    		'    </div>\n' +
    		'</div>'
        );
        
        test.done();
    },

    testHTMLTemplateFileLocalizeNoStrings: function(test) {
        test.expect(3);

        var base = path.dirname(module.id);
        
        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, path.join(base, "testfiles"));
        
        var htf = new HTMLTemplateFile(p, "./tmpl/nostrings.tmpl.html");
        test.ok(htf);
        
        // should read the file
        htf.extract();
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'Get doctor answers for free!',
        	source: 'Obtenir des réponses de médecins gratuitement!',
        	locale: "fr-FR"
        }));
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'Get doctor answers for free!',
        	source: 'Kostenlosen antworten von Ärzten erhalten!',
        	locale: "de-DE"
        }));

        htf.localize(translations, ["fr-FR", "de-DE"]);
        
        // should produce the files, even if there is nothing to localize in them
        test.ok(fs.existsSync(path.join(base, "testfiles/tmpl/nostrings.fr-FR.tmpl.html")));
        test.ok(fs.existsSync(path.join(base, "testfiles/tmpl/nostrings.de-DE.tmpl.html")));
        
        test.done();
    },
    
    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <span <% if (condition) { %>class="foo"<% } %>> Dr. <%= family_name %> is not available.</span>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource('Dr. <%= family_name %> is not available.');
        test.ok(r);
        test.equal(r.getSource(), 'Dr. <%= family_name %> is not available.');
        test.equal(r.getKey(), 'Dr. <%= family_name %> is not available.');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'Dr. <%= family_name %> is not available.',
        	source: 'Dr. <%= family_name %> n\'est pas disponible.',
        	locale: "fr-FR"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
        		'<html>\n' +
        		'   <body>\n' + 
        		'       <span <% if (condition) { %> class="foo" <% } %>> Dr. <%= family_name %> n\'est pas disponible.</span>\n' +
        		'   </body>\n' +
        		'</html>\n');

        test.done();
    },
    
    testHTMLTemplateFileLocalizeTextNonTemplateTagsInsideTags: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html>\n' +
        		'   <body>\n' + 
        		'       <span class="foo" <span class="bar"> Dr. <%= family_name %> is not available.</span></span>\n' +
        		'   </body>\n' +
        		'</html>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource('Dr. <%= family_name %> is not available.');
        test.ok(r);
        test.equal(r.getSource(), 'Dr. <%= family_name %> is not available.');
        test.equal(r.getKey(), 'Dr. <%= family_name %> is not available.');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'Dr. <%= family_name %> is not available.',
        	source: 'Dr. <%= family_name %> n\'est pas disponible.',
        	locale: "fr-FR"
        }));

        var actual = htf.localizeText(translations, "fr-FR");
        var expected =
        		'<html>\n' +
        		'   <body>\n' + 
        		'       <span class="foo" span="" class="bar"> Dr. <%= family_name %> n\'est pas disponible.</span></span>\n' +
        		'   </body>\n' +
        		'</html>\n';

        diff(actual, expected);
		test.equal(actual, expected);
        test.done();
    },

    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags2: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse(
        	'<input class="fg-radio" id="entity_group" type="radio" name="entity" value="group" <% if(expert.entity_type == \'group\'){ %>checked=yes<% } %> >\n' +
        	'<label for="entity_group" class="radio-label">Group</label>');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource('Group');
        test.ok(r);
        test.equal(r.getSource(), 'Group');
        test.equal(r.getKey(), 'Group');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'Group',
        	source: 'Groupe',
        	locale: "fr-FR"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
        		'<input class="fg-radio" id="entity_group" type="radio" name="entity" value="group" <% if(expert.entity_type == \'group\'){ %> checked=yes <% } %>>\n' +
            	'<label for="entity_group" class="radio-label">Groupe</label>');

        test.done();
    },
    
    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags3: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse(
        	'    <select class=\'end_hour\' value=<%=end_hour%>>\n' +
            '      foo\n' +
            '    </select>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource('foo');
        test.ok(r);
        test.equal(r.getSource(), 'foo');
        test.equal(r.getKey(), 'foo');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'foo',
        	source: 'asdf',
        	locale: "fr-FR"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
        		'    <select class=\'end_hour\' value="<%=end_hour%>">\n' +
                '      asdf\n' +
                '    </select>\n');

        test.done();
    },
    
    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags4: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse(
        	'<span has-sub-options = <%= option.sub_options.length > 0 %> data-tracking-value = "<%= option.tracking_value%>" >\n' +
            '    foo\n' +
            '</span>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource('foo');
        test.ok(r);
        test.equal(r.getSource(), 'foo');
        test.equal(r.getKey(), 'foo');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'foo',
        	source: 'asdf',
        	locale: "fr-FR"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
        		'<span has-sub-options="<%= option.sub_options.length > 0 %>" data-tracking-value="<%= option.tracking_value%>">\n' +
                '    asdf\n' +
                '</span>\n');

        test.done();
    },
    
    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags5: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<a class="doctor-name" href=<%= val.expert.url%>>foo</a>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource('foo');
        test.ok(r);
        test.equal(r.getSource(), 'foo');
        test.equal(r.getKey(), 'foo');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'foo',
        	source: 'asdf',
        	locale: "fr-FR"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
        		'<a class="doctor-name" href=<%= val.expert.url%>>asdf</a>\n');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags6: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse(
    		'<% _.each(experts, function( val, index ){ %>\n' +
    		'  <div class="expert-review">\n' +
    		'    <div class="doctor-item" >\n' +
    		'      <div class="doctor-avatar" style="background-image: url(<%= val.expert.avatar_transparent_circular %>);"></div>\n' +
    		'      <div class="doctor-info">\n' +
    		'        <div class="caduceus"></div>\n' +
    		'        <a class="doctor-name" href=<%= val.expert.url%>><%= val.expert.name%></a>\n' +
    		'        <div class ="specialty"><%= val.expert.intro%></div>\n' +
    		'      </div>\n' +
    		'    </div>\n' +
    		'    <div class="rating-stars">\n' +
    		'      <% for (var index = 1; index<=5; index++) {%>\n' +
    		'        <% if (val.rating < index) {%>\n' +
    		'          <div class="rating-star-empty"></div>\n' +
    		'        <% } else { %>\n' +
    		'          <div class="rating-star-filled"></div>\n' +
    		'        <% } %>\n' +
    		'      <% } %>\n' +
    		'    </div>\n' +
    		'    <div class="notes">\n' +
    		'      <%= val.note%>\n' +
    		'      foo\n' +
    		'    </div>\n' +
    		'  </div>\n' +
    		'<% }) %>');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource('foo');
        test.ok(r);
        test.equal(r.getSource(), 'foo');
        test.equal(r.getKey(), 'foo');
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'foo',
        	source: 'asdf',
        	locale: "fr-FR"
        }));
        
        var actual = htf.localizeText(translations, "fr-FR");
        var expected =
    		'<% _.each(experts, function( val, index ){ %>\n' +
    		'  <div class="expert-review">\n' +
    		'    <div class="doctor-item">\n' +
    		'      <div class="doctor-avatar" style="background-image: url(<%= val.expert.avatar_transparent_circular %>);"></div>\n' +
    		'      <div class="doctor-info">\n' +
    		'        <div class="caduceus"></div>\n' +
    		'        <a class="doctor-name" href=<%= val.expert.url%>><%= val.expert.name%></a>\n' +
    		'        <div class="specialty"><%= val.expert.intro%></div>\n' +
    		'      </div>\n' +
    		'    </div>\n' +
    		'    <div class="rating-stars">\n' +
    		'      <% for (var index = 1; index<=5; index++) {%>\n' +
    		'        <% if (val.rating < index) {%>\n' +
    		'          <div class="rating-star-empty"></div>\n' +
    		'        <% } else { %>\n' +
    		'          <div class="rating-star-filled"></div>\n' +
    		'        <% } %>\n' +
    		'      <% } %>\n' +
    		'    </div>\n' +
    		'    <div class="notes">\n' +
    		'      <%= val.note%>\n' +
    		'      asdf\n' +
    		'    </div>\n' +
    		'  </div>\n' +
    		'<% }) %>';
        diff(actual, expected);
    	test.equal(actual, expected);
    		
        test.done();
    },
    
    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags7: function(test) {
        test.expect(6);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<div class="select-wrap select-country left additional-field <%= version ? "new-version" : ""%>">\nfoo\n</div>');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource('foo');
        test.ok(r);
        test.equal(r.getSource(), 'foo');
        test.equal(r.getKey(), 'foo');
    
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'foo',
        	source: 'asdf',
        	locale: "fr-FR"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
        		'<div class="select-wrap select-country left additional-field <%= version ? "new-version" : ""%>">\nasdf\n</div>');

        test.done();
    },
    
    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags8: function(test) {
        test.expect(3);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<div class="star <%= (doc_score > 30) ? "filled-star" : (doc_score > 20) ? "half-star" : "empty-star"%>"></div>');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'foo',
        	source: 'asdf',
        	locale: "fr-FR"
        }));

        test.equal(htf.localizeText(translations, "fr-FR"),
        		'<div class="star <%= (doc_score > 30) ? "filled-star" : (doc_score > 20) ? "half-star" : "empty-star"%>"></div>');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextTemplateTagsInsideTags9: function(test) {
        test.expect(3);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse(
        		'  <% if(two_buttons){ %>\n' +
        		'    <div class="btn grey btn-left"><%= cancel_btn.text %></div>\n' +
        		'    <div class="btn btn-right blue"><%= confirm_btn.text %></div>\n' +
        		'  <% } else { %>\n' +
        		'    <div class="btn grey confirm-btn" style="width: 93%" ><%= confirm_btn.text %></div>\n' +
        		'  <% } %>');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'foo',
        	source: 'asdf',
        	locale: "fr-FR"
        }));

        diff(htf.localizeText(translations, "fr-FR"),
        		'  <% if(two_buttons){ %>\n' +
        		'    <div class="btn grey btn-left"><%= cancel_btn.text %></div>\n' +
        		'    <div class="btn btn-right blue"><%= confirm_btn.text %></div>\n' +
        		'  <% } else { %>\n' +
        		'    <div class="btn grey confirm-btn" style="width: 93%"><%= confirm_btn.text %></div>\n' +
        		'  <% } %>');
        
        test.equal(htf.localizeText(translations, "fr-FR"),
        		'  <% if(two_buttons){ %>\n' +
        		'    <div class="btn grey btn-left"><%= cancel_btn.text %></div>\n' +
        		'    <div class="btn btn-right blue"><%= confirm_btn.text %></div>\n' +
        		'  <% } else { %>\n' +
        		'    <div class="btn grey confirm-btn" style="width: 93%"><%= confirm_btn.text %></div>\n' +
        		'  <% } %>');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextEscapeDoubleQuotes: function(test) {
        test.expect(3);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('  <span class="foo" onclick=\'javascript:var a = "foo", b = "bar";\'>foo</span>');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'foo',
        	source: 'asdf',
        	locale: "fr-FR"
        }));

        diff(htf.localizeText(translations, "fr-FR"),
        		'  <span class="foo" onclick=\'javascript:var a = &quot;foo&quot;, b = &quot;bar&quot;;\'>asdf</span>');
        
        test.equal(htf.localizeText(translations, "fr-FR"),
        		'  <span class="foo" onclick=\'javascript:var a = &quot;foo&quot;, b = &quot;bar&quot;;\'>asdf</span>');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextEscapeDoubleQuotesButNotInTemplateTags: function(test) {
        test.expect(3);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('  <span class="foo" foo=\'asdf <% if (state === "selected") { %>selected<% } %>\'>foo</span>');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'foo',
        	source: 'asdf',
        	locale: "fr-FR"
        }));

        diff(htf.localizeText(translations, "fr-FR"),
        		'  <span class="foo" foo=\'asdf <% if (state === "selected") { %>selected<% } %>\'>asdf</span>');
        
        test.equal(htf.localizeText(translations, "fr-FR"),
        		'  <span class="foo" foo=\'asdf <% if (state === "selected") { %>selected<% } %>\'>asdf</span>');

        test.done();
    },

    testHTMLTemplateFileLocalizeTextEscapeDoubleQuotesButNotInTemplateTagsWithPercentInThem: function(test) {
        test.expect(3);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('  <span class="foo" foo=\'asdf <% if (string === "20%") { %>selected<% } %>\'>foo</span>');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'foo',
        	source: 'asdf',
        	locale: "fr-FR"
        }));

        diff(htf.localizeText(translations, "fr-FR"),
        		'  <span class="foo" foo=\'asdf <% if (string === "20%") { %>selected<% } %>\'>asdf</span>');
        
        test.equal(htf.localizeText(translations, "fr-FR"),
        		'  <span class="foo" foo=\'asdf <% if (string === "20%") { %>selected<% } %>\'>asdf</span>');

        test.done();
    },
    
    testHTMLTemplateFileLocalizeTextIgnoreTags: function(test) {
        test.expect(3);

        var p = new WebProject({
        	id: "ht-webapp12",
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse('<html><body><script type="javascript">\n' +
           	'  foo\n' +
        	'</script>\n' +
        	'<span class="foo">foo</span>\n' + 
        	'</body></html>');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "ht-webapp12",
        	key: 'foo',
        	source: 'asdf',
        	locale: "fr-FR"
        }));

        diff(htf.localizeText(translations, "fr-FR"),
        		'<html><body><script type="javascript">\n' +
            	'  foo\n' +
            	'</script>\n' +
            	'<span class="foo">asdf</span>\n' + 
            	'</body></html>');
        
        test.equal(htf.localizeText(translations, "fr-FR"),
        		'<html><body><script type="javascript">\n' +
            	'  foo\n' +
            	'</script>\n' +
            	'<span class="foo">asdf</span>\n' + 
            	'</body></html>');

        test.done();
    },
    
    testHTMLTemplateFileLocalizeTextWithEmbeddedTemplateTag: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse(
			'<% var date = new Date(updated_at).toDateString().split(\' \'); %>\n' +
			'<% var dateString = date[1] + \' \' + date[2] + \', \' + date[3]; %>\n' +
			'<% var measurement = (upload_file_size > 999999) ? \'MB\' : \'KB\'; %>\n' +
			'<% var fileSize = (measurement == \'MB\') ? upload_file_size / 1000000.0 : upload_file_size / 1000.0; %>\n' +
			'<% fileSize = fileSize.toString(); %>\n' +
			'<% fileSize = fileSize.substring(0, fileSize.indexOf(\'.\') + 3) %>\n' +
			'<div class="chat-attachment">\n' +
			'  <a href="<%= url %>" target="_blank">\n' +
			'    <%if (upload_content_type.indexOf(\'image\') > -1) { %>\n' +
			'      <img class="uploaded-image" src="<%= url %>" />\n' +
			'    <% } else { %>\n' +
			'      <div class="attachment-placeholder">\n' +
			'        <div class="attachment-icon"></div>\n' +
			'      </div>\n' +
			'    <% } %>\n' +
			'  </a>\n' +
			'  <% if (caption) { %>\n' +
			'    <div class="attachment-caption">\n' +
			'      <%= caption %>\n' +
			'    </div>\n' +
			'  <% } %>\n' +
			'  <div class="attachment-timestamp">\n' +
			'    Uploaded <%= dateString %>\n' +
			'  </div>\n' +
			'  <div class="attachment-size">\n' +
			'    <%= fileSize + \' \' + measurement %> \n' +
			'  </div>\n' +
			'</div>    \n');
			
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'Uploaded <%= dateString %>',
        	source: 'Téléchargé sur <%= dateString %>',
        	locale: "fr-FR"
        }));
                
        diff(htf.localizeText(translations, "fr-FR"),
    			'<% var date = new Date(updated_at).toDateString().split(\' \'); %>\n' +
    			'<% var dateString = date[1] + \' \' + date[2] + \', \' + date[3]; %>\n' +
    			'<% var measurement = (upload_file_size > 999999) ? \'MB\' : \'KB\'; %>\n' +
    			'<% var fileSize = (measurement == \'MB\') ? upload_file_size / 1000000.0 : upload_file_size / 1000.0; %>\n' +
    			'<% fileSize = fileSize.toString(); %>\n' +
    			'<% fileSize = fileSize.substring(0, fileSize.indexOf(\'.\') + 3) %>\n' +
    			'<div class="chat-attachment">\n' +
    			'  <a href="<%= url %>" target="_blank">\n' +
    			'    <%if (upload_content_type.indexOf(\'image\') > -1) { %>\n' +
    			'      <img class="uploaded-image" src="<%= url %>">\n' +
    			'    <% } else { %>\n' +
    			'      <div class="attachment-placeholder">\n' +
    			'        <div class="attachment-icon"></div>\n' +
    			'      </div>\n' +
    			'    <% } %>\n' +
    			'  </a>\n' +
    			'  <% if (caption) { %>\n' +
    			'    <div class="attachment-caption">\n' +
    			'      <%= caption %>\n' +
    			'    </div>\n' +
    			'  <% } %>\n' +
    			'  <div class="attachment-timestamp">\n' +
    			'    Téléchargé sur <%= dateString %>\n' +
    			'  </div>\n' +
    			'  <div class="attachment-size">\n' +
    			'    <%= fileSize + \' \' + measurement %> \n' +
    			'  </div>\n' +
    			'</div>    \n');
        
        test.equal(htf.localizeText(translations, "fr-FR"),
    			'<% var date = new Date(updated_at).toDateString().split(\' \'); %>\n' +
    			'<% var dateString = date[1] + \' \' + date[2] + \', \' + date[3]; %>\n' +
    			'<% var measurement = (upload_file_size > 999999) ? \'MB\' : \'KB\'; %>\n' +
    			'<% var fileSize = (measurement == \'MB\') ? upload_file_size / 1000000.0 : upload_file_size / 1000.0; %>\n' +
    			'<% fileSize = fileSize.toString(); %>\n' +
    			'<% fileSize = fileSize.substring(0, fileSize.indexOf(\'.\') + 3) %>\n' +
    			'<div class="chat-attachment">\n' +
    			'  <a href="<%= url %>" target="_blank">\n' +
    			'    <%if (upload_content_type.indexOf(\'image\') > -1) { %>\n' +
    			'      <img class="uploaded-image" src="<%= url %>">\n' +
    			'    <% } else { %>\n' +
    			'      <div class="attachment-placeholder">\n' +
    			'        <div class="attachment-icon"></div>\n' +
    			'      </div>\n' +
    			'    <% } %>\n' +
    			'  </a>\n' +
    			'  <% if (caption) { %>\n' +
    			'    <div class="attachment-caption">\n' +
    			'      <%= caption %>\n' +
    			'    </div>\n' +
    			'  <% } %>\n' +
    			'  <div class="attachment-timestamp">\n' +
    			'    Téléchargé sur <%= dateString %>\n' +
    			'  </div>\n' +
    			'  <div class="attachment-size">\n' +
    			'    <%= fileSize + \' \' + measurement %> \n' +
    			'  </div>\n' +
    			'</div>    \n');
                
        test.done();
    },
    
    testHTMLTemplateFileParseWithHTMLInTheTemplateTag: function(test) {
        test.expect(11);

        var p = new WebProject({
        	sourceLocale: "en-US"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse(
        		'<div class = "modal-title">\n' +
        		'  Assumptions\n' +
        		'</div>  \n' +
        		'<div class="static_text clearfix">\n' +
        		'	<p>\n' +
        		'	  <%=\n' +
        		'	    RB.getString(\'The following values were assumed when calculating the ROI. To receive an even more customized ROI analysis tailored to your organization, please {link_tag_start}schedule a call{link_tag_end} with us.\').format({\n' +
        		'	      link_tag_start: \'<a href="\'+ calendly_link + \'" target="_blank" >\',\n' +
        		'	      link_tag_end: \'</a>\'\n' +
        		'	    })\n' +
        		'	  %>\n' +
        		'	\n' +
        		'	</p>\n' +
        		'	<br/>\n' +
        		'	<ul class="fg-list" >\n' +
        		'	  <li>30% specialist office referrals form virtual consult</li>\n' +
        		'	  <li>20% doctor office visits diverted to Q&A</li>\n' +
        		'	  <li>20% virtual consult utilization, post-Q&A</li>\n' +
        		'	  <li>75% lab cost as percent of doctor office visit</li>\n' +
        		'	  <li>10% of urgent care visits diverted to virtual consult only</li>\n' +
        		'	  <li>10% ER visits diverted to virtual consult only</li>\n' +
        		'	  <li>30% ER visits diverted to urgent care</li> \n' +
        		'	</ul>         \n' +
        		'</div>\n');
        
        var set = htf.getTranslationSet();
        test.ok(set);
        
        var r = set.getBySource("Assumptions");
        test.ok(r);
        test.equal(r.getSource(), "Assumptions");
        test.equal(r.getKey(), "Assumptions");
        
        r = set.getBySource('30% specialist office referrals form virtual consult');
        test.ok(r);
        test.equal(r.getSource(), '30% specialist office referrals form virtual consult');
        test.equal(r.getKey(), '30% specialist office referrals form virtual consult');
        
        r = set.getBySource('30% ER visits diverted to urgent care');
        test.ok(r);
        test.equal(r.getSource(), '30% ER visits diverted to urgent care');
        test.equal(r.getKey(), '30% ER visits diverted to urgent care');
        
        test.done();
    },

    testHTMLTemplateFileLocalizeTextWithEmbeddedTemplateTag: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse(
    		'<div class = "modal-title">\n' +
    		'  Assumptions\n' +
    		'</div>  \n' +
    		'<div class="static_text clearfix">\n' +
    		'	<p>\n' +
    		'	  <%=\n' +
    		'	    RB.getString(\'The following values were assumed when calculating the ROI. To receive an even more customized ROI analysis tailored to your organization, please {link_tag_start}schedule a call{link_tag_end} with us.\').format({\n' +
    		'	      link_tag_start: \'<a href="\'+ calendly_link + \'" target="_blank" >\',\n' +
    		'	      link_tag_end: \'</a>\'\n' +
    		'	    })\n' +
    		'	  %>\n' +
    		'	\n' +
    		'	</p>\n' +
    		'	<br/>\n' +
    		'	<ul class="fg-list" >\n' +
    		'	  <li>30% specialist office referrals form virtual consult</li>\n' +
    		'	  <li>20% doctor office visits diverted to Q&A</li>\n' +
    		'	  <li>20% virtual consult utilization, post-Q&A</li>\n' +
    		'	  <li>75% lab cost as percent of doctor office visit</li>\n' +
    		'	  <li>10% of urgent care visits diverted to virtual consult only</li>\n' +
    		'	  <li>10% ER visits diverted to virtual consult only</li>\n' +
    		'	  <li>30% ER visits diverted to urgent care</li> \n' +
    		'	</ul>         \n' +
    		'</div>\n');
			
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'Assumptions',
        	source: 'Téléchargé sur <%= dateString %>',
        	locale: "fr-FR"
        }));
                
        diff(htf.localizeText(translations, "fr-FR"),
        		'<div class="modal-title">\n' +
        		'  Téléchargé sur <%= dateString %>\n' +
        		'</div>  \n' +
        		'<div class="static_text clearfix">\n' +
        		'	<p>\n' +
        		'	  <%=\n' +
        		'	    RB.getString(\'The following values were assumed when calculating the ROI. To receive an even more customized ROI analysis tailored to your organization, please {link_tag_start}schedule a call{link_tag_end} with us.\').format({\n' +
        		'	      link_tag_start: \'<a href="\'+ calendly_link + \'" target="_blank" >\',\n' +
        		'	      link_tag_end: \'</a>\'\n' +
        		'	    })\n' +
        		'	  %>\n' +
        		'	\n' +
        		'	</p>\n' +
        		'	<br>\n' +
        		'	<ul class="fg-list">\n' +
        		'	  <li>30% specialist office referrals form virtual consult</li>\n' +
        		'	  <li>20% doctor office visits diverted to Q&A</li>\n' +
        		'	  <li>20% virtual consult utilization, post-Q&A</li>\n' +
        		'	  <li>75% lab cost as percent of doctor office visit</li>\n' +
        		'	  <li>10% of urgent care visits diverted to virtual consult only</li>\n' +
        		'	  <li>10% ER visits diverted to virtual consult only</li>\n' +
        		'	  <li>30% ER visits diverted to urgent care</li> \n' +
        		'	</ul>         \n' +
        		'</div>\n');
        
        test.equal(htf.localizeText(translations, "fr-FR"),
        		'<div class="modal-title">\n' +
        		'  Téléchargé sur <%= dateString %>\n' +
        		'</div>  \n' +
        		'<div class="static_text clearfix">\n' +
        		'	<p>\n' +
        		'	  <%=\n' +
        		'	    RB.getString(\'The following values were assumed when calculating the ROI. To receive an even more customized ROI analysis tailored to your organization, please {link_tag_start}schedule a call{link_tag_end} with us.\').format({\n' +
        		'	      link_tag_start: \'<a href="\'+ calendly_link + \'" target="_blank" >\',\n' +
        		'	      link_tag_end: \'</a>\'\n' +
        		'	    })\n' +
        		'	  %>\n' +
        		'	\n' +
        		'	</p>\n' +
        		'	<br>\n' +
        		'	<ul class="fg-list">\n' +
        		'	  <li>30% specialist office referrals form virtual consult</li>\n' +
        		'	  <li>20% doctor office visits diverted to Q&A</li>\n' +
        		'	  <li>20% virtual consult utilization, post-Q&A</li>\n' +
        		'	  <li>75% lab cost as percent of doctor office visit</li>\n' +
        		'	  <li>10% of urgent care visits diverted to virtual consult only</li>\n' +
        		'	  <li>10% ER visits diverted to virtual consult only</li>\n' +
        		'	  <li>30% ER visits diverted to urgent care</li> \n' +
        		'	</ul>         \n' +
        		'</div>\n');
                
        test.done();
    },

    testHTMLTemplateFileLocalizeTextBug1: function(test) {
        test.expect(2);

        var p = new WebProject({
        	sourceLocale: "en-US",
        	id: "foo"
        }, "./testfiles");
        
        var htf = new HTMLTemplateFile(p);
        test.ok(htf);
        
        htf.parse(
			'<%\n' +
			'  var accepts_insurance, concierge_hidden, provider_group, HMO_provider;\n' +
			'  var person_obj = person_obj || {};\n' +
			
			'  var member_group = (person_obj.network_provider_groups && person_obj.network_provider_groups.length) ? person_obj.network_provider_groups[0] : {};\n' +
			
			'  concierge_hidden = !person_obj.concierge_allowed;\n' +
			
			'  if (ht_expert.provider_groups) {\n' +
			'    var provider_ids = _.pluck(JSON.parse(ht_expert.provider_groups), \'id\');\n' +
			'    accepts_insurance = (provider_ids.indexOf(parseInt(member_group.id)) >= 0);\n' +
			'  }\n' +
			
			'  if (member_group.is_hmo) {\n' +
			'    HMO_provider = member_group.name;\n' +
			'  }\n' +
			
			'  accepts_insurance = accepts_insurance || false;\n' +
			'  concierge_hidden = concierge_hidden || false;\n' +
			'  HMO_provider = HMO_provider || false;\n' +
			'%>\n' +
			
			'<div class="refer-doc-message">\n' +
			'  I\'d like to refer you to<%= HMO_provider ? (\' the following specialist. As a member of \' + HMO_provider + \', please first check with your primary care physician before seeing this specialist\') : \'\' %>:\n' +
			'  <div class="doctor-result clearfix">\n' +
			'<% var imageStyle = ht_expert.avatar_transparent_circular ? "background-image: url(\'"+ht_expert.avatar_transparent_circular+ "\')" : "" %>\n' +
			'<div class="avatar left" style="<%= imageStyle %>"></div>\n' +
			'<div class="caduceus left"></div>\n' +
			'<div class="doctor-info">\n' +
			'  <% if (ht_expert) { %>\n' +
			'    <a class="doctor-name emphasis" href="<%= feelGood.linkToExpert(ht_expert_id) %>">\n' +
			'      <%= ht_expert.value %>\n' +
			'    </a>\n' +
			'    <div class="specialty" >\n' +
			'      <%= ht_expert.intro %>\n' +
			'    </div>\n' +
			'    <%= window.templates[\'_ratings\']({\n' +
			'      doc_score: ht_expert.doc_score,\n' +
			'      hide_5th_star: false\n' +
			'    }) %>\n' +
			'    <% if (ht_expert.display_location) { %>\n' +
			'      <div class="location">\n' +
			'        <div class="small-location-icon"></div>\n' +
			'        <%= ht_expert.display_location %>\n' +
			'      </div>\n' +
			'    <% } %>\n' +
			'    <% if (ht_expert.in_network && ht_expert.in_network_display_string) { %>\n' +
			'      <div class="concierge-buttons">\n' +
			'        <div class="accepts-insurance">\n' +
			'          <div class="green_check"></div>\n' +
			'          <%= ht_expert.in_network_display_string %>\n' +
			'        </div>\n' +
			'      </div>\n' +
			'    <% } %>\n' +
			'    <% if (ht_expert.in_concierge && ht_expert.in_concierge != "false" && !concierge_hidden) { %>\n' +
			'      <div class="concierge-buttons">\n' +
			'      <a class="concierge-btn message-btn tooltip-link" href="/experts/<%=ht_expert.id %>/message" track_event="request_message" track_data=\'{"type": "transcript"}\'>\n' +
			'        <div class="concierge-btn-icon-msg"></div>\n' +
			'        <div class="tooltip-info"> Send Message </div>\n' +
			'      </a>\n' +
			'      <a class="concierge-btn appointment-btn tooltip-link" href="/experts/<%=ht_expert.id %>/appointment" track_event="request_appointment" track_data=\'{"type": "transcript"}\'>\n' +
			'        <div class="concierge-btn-icon-appt"></div>\n' +
			'        <div class="tooltip-info"> Virtual Appointment</div>\n' +
			'      </a>\n' +
			'      <a class="concierge-btn talk-btn tooltip-link" href="/experts/<%=ht_expert.id %>/talk" track_event="request_talk" track_data=\'{"type": "transcript"}\'>\n' +
			'        <div class="concierge-btn-icon-video"></div>\n' +
			'        <div class="tooltip-info"> Video/Chat</div>\n' +
			'      </a>\n' +
			'      </div>\n' +
			'    <% } %>\n' +
			'  <% } else { %>\n' +
			'    <div class="doctor-name emphasis">\n' +
			'      <%= non_ht_expert_name %>\n' +
			'    </div>\n' +
			'    <% if (non_ht_tel && non_ht_tel.length >= 7) { %>\n' +
			'      <div class="specialty">\n' +
			'        Call: <%= non_ht_tel %>\n' +
			'      </div>\n' +
			'    <% } %>\n' +
			'    <% if (non_ht_expert_email ) { %>\n' +
			'      <div class="specialty">\n' +
			'            Email: <%= non_ht_expert_email %>\n' +
			'          </div>\n' +
			'        <% } %>\n' +
			
			'      <% } %>\n' +
			'    </div>\n' +
			'  </div>\n' +
			'</div>\n'
        );
			
        var translations = new TranslationSet();
        translations.add(new ResourceString({
        	project: "foo",
        	key: 'I\'d like to refer you to<%= HMO_provider ? (\' the following specialist. As a member of \' + HMO_provider + \', please first check with your primary care physician before seeing this specialist\') : \'\' %>:',
        	source: 'Ich moechte Sie referieren an<%= HMO_provider ? (\' the following specialist. As a member of \' + HMO_provider + \', please first check with your primary care physician before seeing this specialist\') : \'\' %>:',
        	locale: "de-DE"
        }));
        
        var actual = htf.localizeText(translations, "de-DE");
        var expected =
    			'<%\n' +
    			'  var accepts_insurance, concierge_hidden, provider_group, HMO_provider;\n' +
    			'  var person_obj = person_obj || {};\n' +
    			
    			'  var member_group = (person_obj.network_provider_groups && person_obj.network_provider_groups.length) ? person_obj.network_provider_groups[0] : {};\n' +
    			
    			'  concierge_hidden = !person_obj.concierge_allowed;\n' +
    			
    			'  if (ht_expert.provider_groups) {\n' +
    			'    var provider_ids = _.pluck(JSON.parse(ht_expert.provider_groups), \'id\');\n' +
    			'    accepts_insurance = (provider_ids.indexOf(parseInt(member_group.id)) >= 0);\n' +
    			'  }\n' +
    			
    			'  if (member_group.is_hmo) {\n' +
    			'    HMO_provider = member_group.name;\n' +
    			'  }\n' +
    			
    			'  accepts_insurance = accepts_insurance || false;\n' +
    			'  concierge_hidden = concierge_hidden || false;\n' +
    			'  HMO_provider = HMO_provider || false;\n' +
    			'%>\n' +
    			
    			'<div class="refer-doc-message">\n' +
    			'  Ich moechte Sie referieren an<%= HMO_provider ? (\' the following specialist. As a member of \' + HMO_provider + \', please first check with your primary care physician before seeing this specialist\') : \'\' %>:\n' +
    			'  <div class="doctor-result clearfix">\n' +
    			'<% var imageStyle = ht_expert.avatar_transparent_circular ? "background-image: url(\'"+ht_expert.avatar_transparent_circular+ "\')" : "" %>\n' +
    			'<div class="avatar left" style="<%= imageStyle %>"></div>\n' +
    			'<div class="caduceus left"></div>\n' +
    			'<div class="doctor-info">\n' +
    			'  <% if (ht_expert) { %>\n' +
    			'    <a class="doctor-name emphasis" href="<%= feelGood.linkToExpert(ht_expert_id) %>">\n' +
    			'      <%= ht_expert.value %>\n' +
    			'    </a>\n' +
    			'    <div class="specialty">\n' +
    			'      <%= ht_expert.intro %>\n' +
    			'    </div>\n' +
    			'    <%= window.templates[\'_ratings\']({\n' +
    			'      doc_score: ht_expert.doc_score,\n' +
    			'      hide_5th_star: false\n' +
    			'    }) %>\n' +
    			'    <% if (ht_expert.display_location) { %>\n' +
    			'      <div class="location">\n' +
    			'        <div class="small-location-icon"></div>\n' +
    			'        <%= ht_expert.display_location %>\n' +
    			'      </div>\n' +
    			'    <% } %>\n' +
    			'    <% if (ht_expert.in_network && ht_expert.in_network_display_string) { %>\n' +
    			'      <div class="concierge-buttons">\n' +
    			'        <div class="accepts-insurance">\n' +
    			'          <div class="green_check"></div>\n' +
    			'          <%= ht_expert.in_network_display_string %>\n' +
    			'        </div>\n' +
    			'      </div>\n' +
    			'    <% } %>\n' +
    			'    <% if (ht_expert.in_concierge && ht_expert.in_concierge != "false" && !concierge_hidden) { %>\n' +
    			'      <div class="concierge-buttons">\n' +
    			'      <a class="concierge-btn message-btn tooltip-link" href="/experts/<%=ht_expert.id %>/message" track_event="request_message" track_data=\'{&quot;type&quot;: &quot;transcript&quot;}\'>\n' +
    			'        <div class="concierge-btn-icon-msg"></div>\n' +
    			'        <div class="tooltip-info"> Send Message </div>\n' +
    			'      </a>\n' +
    			'      <a class="concierge-btn appointment-btn tooltip-link" href="/experts/<%=ht_expert.id %>/appointment" track_event="request_appointment" track_data=\'{&quot;type&quot;: &quot;transcript&quot;}\'>\n' +
    			'        <div class="concierge-btn-icon-appt"></div>\n' +
    			'        <div class="tooltip-info"> Virtual Appointment</div>\n' +
    			'      </a>\n' +
    			'      <a class="concierge-btn talk-btn tooltip-link" href="/experts/<%=ht_expert.id %>/talk" track_event="request_talk" track_data=\'{&quot;type&quot;: &quot;transcript&quot;}\'>\n' +
    			'        <div class="concierge-btn-icon-video"></div>\n' +
    			'        <div class="tooltip-info"> Video/Chat</div>\n' +
    			'      </a>\n' +
    			'      </div>\n' +
    			'    <% } %>\n' +
    			'  <% } else { %>\n' +
    			'    <div class="doctor-name emphasis">\n' +
    			'      <%= non_ht_expert_name %>\n' +
    			'    </div>\n' +
    			'    <% if (non_ht_tel && non_ht_tel.length >= 7) { %>\n' +
    			'      <div class="specialty">\n' +
    			'        Call: <%= non_ht_tel %>\n' +
    			'      </div>\n' +
    			'    <% } %>\n' +
    			'    <% if (non_ht_expert_email ) { %>\n' +
    			'      <div class="specialty">\n' +
    			'            Email: <%= non_ht_expert_email %>\n' +
    			'          </div>\n' +
    			'        <% } %>\n' +
    			
    			'      <% } %>\n' +
    			'    </div>\n' +
    			'  </div>\n' +
    			'</div>\n';
        
        diff(actual, expected);
        test.equal(actual, expected);
              
        test.done();
    }
};