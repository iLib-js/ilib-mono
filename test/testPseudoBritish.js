/*
 * testPseudoBritish.js - test the US to British English spell-corrector
 *
 * Copyright © 2017, Healthtap, Inc. All Rights Reserved.
 */

if (!PseudoFactory) {
    var PseudoFactory = require("../lib/PseudoFactory.js");
    var WebProject = require("../lib/WebProject.js");
}

var project = new WebProject({
	sourceLocale: "en-US",
	pseudoLocale: "ps-DO",
	resourceDirs: {
		"yml": "config/locales"
	}
}, "./testfiles", {
	locales: ["en-GB", "en-NZ", "es-US"]
});

module.exports = {
    testPseudoBritishSimpleWord: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getStringJS("traveler"), "traveller");
        
        test.done();
    },

    testPseudoBritishComplex: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getStringJS("I am a traveler of regions far and wide."), "I am a traveller of regions far and wide.");
        
        test.done();
    },
    
    testPseudoBritishOddWordBoundaries: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getStringJS("I am a traveler, for the most part, of regions far and wide."), "I am a traveller, for the most part, of regions far and wide.");
        
        test.done();
    },

    testPseudoBritishPunctWordBoundaries: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getStringJS("I am a traveler."), "I am a traveller.");
        
        test.done();
    },

    testPseudoBritishSingleWord: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getStringJS("globalization"), "globalisation");
        
        test.done();
    },
    
    testPseudoBritishInitialCapital: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getStringJS("Globalization"), "Globalisation");
        
        test.done();
    },

    testPseudoBritishAllCapitals: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getStringJS("GLOBALIZATION"), "GLOBALISATION");
        
        test.done();
    },

    testPseudoBritishNoSubWords: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getStringJS("I'm not about to retire"), "I'm not about to retire"); // no translation
        
        test.done();
    },

    testPseudoBritishIncludeQuotes: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getStringJS("The spirochete's proteins were difficult to decipher."), "The spirochaete's proteins were difficult to decipher.");
        
        test.done();
    },
    
    testPseudoBritishSkipReplacementsJava: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "java"
		});
        test.equal(pb.getStringJS("Skip the unflavored {estrogen} supplements."), "Skip the unflavoured {estrogen} supplements.");
        
        test.done();
    },
    
    testPseudoBritishSkipReplacementsJavascript: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "javascript"
		});
        test.equal(pb.getStringJS("Skip the unflavored {estrogen} supplements."), "Skip the unflavoured {estrogen} supplements.");
        
        test.done();
    },
    
    testPseudoBritishSkipReplacementsHTML: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "html"
		});
        test.equal(pb.getStringJS("Skip the unflavored <span name=\"estrogen\">supplements</a>."), "Skip the unflavoured <span name=\"estrogen\">supplements</a>.");
        
        test.done();
    },

    testPseudoBritishSkipReplacementsXML: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "xml"
		});
        test.equal(pb.getStringJS("Skip the unflavored <source id=\"estrogen\">supplements</source>."), "Skip the unflavoured <source id=\"estrogen\">supplements</source>.");
        
        test.done();
    },

    testPseudoBritishSkipReplacementsTemplate: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "template"
		});
        test.equal(pb.getStringJS("Skip the unflavored <%= (i > 4) ? RB.getString(\"estrogen\") : RB.getString(\"%\") %> supplements."), "Skip the unflavoured <%= (i > 4) ? RB.getString(\"estrogen\") : RB.getString(\"%\") %> supplements.");
        
        test.done();
    },
    
    testPseudoBritishSkipReplacementsRuby: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "ruby"
		});
        test.equal(pb.getStringJS("Skip the unflavored %{estrogen} #{estrogen} supplements."), "Skip the unflavoured %{estrogen} #{estrogen} supplements.");
        
        test.done();
    },

    testPseudoBritishSkipReplacementsPlaintext: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-GB",
			type: "text"
		});
        test.equal(pb.getStringJS("Skip the unflavored {estrogen} supplements."), "Skip the unflavoured {oestrogen} supplements.");
        
        test.done();
    },
    
    testPseudoBritishInheritedLocaleNZ: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-NZ",
			type: "text"
		});
        test.equal(pb.getStringJS("colorful globalization traveler"), "colourful globalisation traveller");
        
        test.done();
    },

    testPseudoBritishInheritedLocaleAU: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-AU",
			type: "text"
		});
        test.equal(pb.getStringJS("colorful globalization traveler"), "colourful globalisation traveller");
        
        test.done();
    },

    testPseudoBritishInheritedLocaleZA: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-ZA",
			type: "text"
		});
        test.equal(pb.getStringJS("colorful globalization traveler"), "colourful globalisation traveller");
        
        test.done();
    },

    testPseudoBritishInheritedLocaleHK: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-HK",
			type: "text"
		});
        test.equal(pb.getStringJS("colorful globalization traveler"), "colourful globalisation traveller");
        
        test.done();
    },

    testPseudoBritishNotInheritedLocalePH: function(test) {
        test.expect(1);

        var pb = PseudoFactory({
			project: project,
			locale: "en-PH", // Philippines uses US English
			type: "text"
		});
        
        test.ok(!pb);
        
        test.done();
    }
};