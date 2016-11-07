/*
 * testIosStringsFile.js - test the Objective C file handler object.
 *
 * Copyright © 2016, Healthtap, Inc. All Rights Reserved.
 */

if (!IosStringsFile) {
    var IosStringsFile = require("../lib/IosStringsFile.js");
    var ObjectiveCProject =  require("../lib/ObjectiveCProject.js");
    var ResourceString =  require("../lib/ResourceString.js");
}

module.exports = {
    testIosStringsFileConstructor: function(test) {
        test.expect(1);

        var strings = new IosStringsFile();
        test.ok(strings);
        
        test.done();
    },
    
    testIosStringsFileConstructorParams: function(test) {
        test.expect(1);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var strings = new IosStringsFile(p, "./testfiles/objc/Base.lproj/Localizable.strings");
        
        test.ok(strings);
        
        test.done();
    },

    testIosStringsFileConstructorNoFile: function(test) {
        test.expect(1);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var strings = new IosStringsFile({
			project: p
		});
        test.ok(strings);
        
        test.done();
    },

    testIosStringsFileParseSimpleGetByKey: function(test) {
        test.expect(6);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var strings = new IosStringsFile({
			project: p
		});
        test.ok(strings);
        
        strings.parse('/* Class = "UIButton"; normalTitle = "Terms"; ObjectID = "2V9-YN-vxb"; */\n' +
        		'"2V9-YN-vxb.normalTitle" = "Terms";\n');
        
        var set = strings.getTranslationSet();
        test.ok(set);
        
        var r = set.getBy({
        	reskey: "2V9-YN-vxb.normalTitle"
        });
        test.ok(r);
        
        test.equal(r[0].getSource(), "Terms");
        test.equal(r[0].getKey(), "2V9-YN-vxb.normalTitle");
        test.equal(r[0].getComment(), 'Class = "UIButton"; normalTitle = "Terms"; ObjectID = "2V9-YN-vxb";');
        
        test.done();
    },

    testIosStringsFileParseWithComment: function(test) {
        test.expect(6);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var strings = new IosStringsFile({
			project: p
		});
        test.ok(strings);
        
        strings.parse('/* this is the terms and conditions button label */\n' +
				'"2V9-YN-vxb.normalTitle" = "Terms";\n');
        
        var set = strings.getTranslationSet();
        test.ok(set);
        
        var r = set.getBy({
        	reskey: "2V9-YN-vxb.normalTitle"
        });
        test.ok(r);
        
        test.equal(r[0].getSource(), "Terms");
        test.equal(r[0].getKey(), "2V9-YN-vxb.normalTitle");
        test.equal(r[0].getComment(), "this is the terms and conditions button label");
        
        test.done();
    },

    testIosStringsFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(6);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var strings = new IosStringsFile({
			project: p
		});
        test.ok(strings);
        
        strings.parse('/*            this is the terms and conditions button label              */\n\n\n\n' +
				'          "2V9-YN-vxb.normalTitle"      \t =    \t "Terms"    ;     \n');
        
        var set = strings.getTranslationSet();
        test.ok(set);
        
        var r = set.getBy({
        	reskey: "2V9-YN-vxb.normalTitle"
        });
        test.ok(r);
        
        test.equal(r[0].getSource(), "Terms");
        test.equal(r[0].getKey(), "2V9-YN-vxb.normalTitle");
        test.equal(r[0].getComment(), "this is the terms and conditions button label");
        
        test.done();
    },


    testIosStringsFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var strings = new IosStringsFile({
			project: p
		});
        test.ok(strings);

        var set = strings.getTranslationSet();
        test.equal(set.size(), 0);

        strings.parse('/* i18n: this is the terms and conditions button label */\n' +
				'"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
				'/* Class = "UILabel"; text = "Are you a doctor?"; ObjectID = "MFI-qx-pQf"; */\n' +
				'"MFI-qx-pQf.text" = "Are you a doctor?";');
        
        test.ok(set);
        
        test.equal(set.size(), 2);
        
        test.done();
    },

    testIosStringsFileParseMultiple: function(test) {
        test.expect(10);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var strings = new IosStringsFile({
			project: p
		});
        test.ok(strings);
        
        strings.parse('/* this is the terms and conditions button label */\n' +
				'"2V9-YN-vxb.normalTitle" = "Terms";\n\n' +
				'/* Class = "UILabel"; text = "Are you a doctor?"; ObjectID = "MFI-qx-pQf"; */\n' +
				'"MFI-qx-pQf.text" = "Are you a doctor?";');
       
        var set = strings.getTranslationSet();
        test.ok(set);
        
        var r = set.getBy({
        	reskey: "2V9-YN-vxb.normalTitle"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Terms");
        test.equal(r[0].getKey(), "2V9-YN-vxb.normalTitle");
        test.equal(r[0].getComment(), "this is the terms and conditions button label");
        
        r = set.getBy({
        	reskey: "MFI-qx-pQf.text"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Are you a doctor?");
        test.equal(r[0].getKey(), "MFI-qx-pQf.text");
        test.equal(r[0].getComment(), 'Class = "UILabel"; text = "Are you a doctor?"; ObjectID = "MFI-qx-pQf";');
        
        test.done();
    },

    testIosStringsFileExtractFile: function(test) {
        test.expect(14);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var strings = new IosStringsFile({
        	project: p, 
        	pathName: "./objc/en.lproj/FGSignUpViewController.strings"
        });
        test.ok(strings);
        
        // should read the file
        strings.extract();
        
        var set = strings.getTranslationSet();
        
        test.equal(set.size(), 15);
        
        var r = set.getBy({
        	reskey: "QCe-xG-x5k.normalTitle"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Login ›");
        test.equal(r[0].getKey(), "QCe-xG-x5k.normalTitle");
        test.equal(r[0].getComment(), 'Class = "UIButton"; normalTitle = "Login ›"; ObjectID = "QCe-xG-x5k";');

        var r = set.getBy({
        	reskey: "WpN-ro-7NU.placeholder"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "Your email");
        test.equal(r[0].getKey(), "WpN-ro-7NU.placeholder");
        test.equal(r[0].getComment(), 'Class = "UITextField"; placeholder = "Your email"; ObjectID = "WpN-ro-7NU";');
        
        var r = set.getBy({
        	reskey: "DWd-6J-lLt.text"
        });
        test.ok(r);
        test.equal(r[0].getSource(), "free, private");
        test.equal(r[0].getKey(), "DWd-6J-lLt.text");
        test.equal(r[0].getComment(), 'Class = "UILabel"; text = "free, private"; ObjectID = "DWd-6J-lLt";');

        test.done();
    },
    
    testIosStringsFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var strings = new IosStringsFile({
			project: p
		});
        test.ok(strings);
        
        // should attempt to read the file and not fail
        strings.extract();
        
        var set = strings.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();
    },

    testIosStringsFileExtractBogusFile: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var strings = new IosStringsFile({
        	project: p, 
        	pathName: "./objc/en.lproj/asdf.strings"
        });
        test.ok(strings);
        
        // should attempt to read the file and not fail
        strings.extract();
        
        var set = strings.getTranslationSet();
        
        test.equal(set.size(), 0);

        test.done();   
    },
    
    testIosStringsFileGetContent: function(test) {
        test.expect(2);

        var p = new ObjectiveCProject({
        	id: "ht-iosapp",
			sourceLocale: "en-US"
        }, "./testfiles");
        
        var strings = new IosStringsFile({
        	project: p, 
        	pathName: "./objc/de.lproj/asdf.strings"
        });
        test.ok(strings);
        
        [
        	new ResourceString({
        		project: "ht-iosapp",
        		locale: "de-DE",
        		key: "source text",
        		source: "Quellen\"text",
        		comment: "foo"
        	}),
        	new ResourceString({
        		project: "ht-iosapp",
        		locale: "de-DE",
        		key: "more source text",
        		source: "mehr Quellen\"text",
        		comment: "bar"
        	})
        ].forEach(function(res) {
        	strings.addResource(res);
        });
        
        test.equal(strings.getContent(),
        	'/* foo */\n' +
        	'"source text"="Quellen\\"text";\n\n' +
        	'/* bar */\n' +
        	'"more source text"="mehr Quellen\\"text";\n\n'
        );
        
        test.done();
    },
    
};