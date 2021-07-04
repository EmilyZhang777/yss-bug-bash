const svgstore = require('svgstore');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const path = require('path');
const SVGO = require('svgo');
const camelCase = require('camelcase');
const slugify = require('slugify');

const svgo = new SVGO({
  plugins: [
    {removeViewBox: false},
    {removeDimensions: false}
  ]
});

const inputDirectory = path.join(process.cwd(), 'sprites/svg_sprites/');

const destDirName = 'assets/generated/';
const destFileName = 'sprites.svg';
const iconsDir = path.join(destDirName, 'optimizedIcons');

const iconsPath = path.join(process.cwd(), iconsDir);
const spritesPath = path.join(process.cwd(), destDirName);
const sassPath = path.join(process.cwd(), 'sass/generated');
const soyPath = path.join(process.cwd(), 'templates/generated');

const cssOutputPath = path.join(sassPath, 'CustomIcons.scss');
const soyOutputPath = path.join(soyPath, 'CustomIcons.soy');

const ensureDirs = [spritesPath, iconsPath, sassPath, soyPath];

function processSVG(file) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path.join(inputDirectory,file), 'utf8', (err, contents) => {
      if (err) {
        reject(err);
        return;
      }
      svgo.optimize(contents).then(res => resolve({filename: file, contents: res.data, info: res.info}));
    });
  });
}

function slugName(name) {
  return slugify(name, '_');
}

function css(name, info) {
  let width = parseInt(info.width),
     height = parseInt(info.height),
     ratio = width/height
     relHeight = height/16
     relWidth = ratio*relHeight;

  return `
.CustomIcon.CustomIcon--${camelCase(name)}
{
  width: ${relWidth}em;
  height: ${relHeight}em;
}

@mixin CustomIcon--${camelCase(name)}($pseudo: 'before')
{
  @include CustomIcon-wrapper;

  &::#{$pseudo}
  {
    @if $pseudo == 'after'
    {
      @include CustomIcon--after;
    }

    @else
    {
      @include CustomIcon--before;
    }

    display: inline-block;
    content: '';
    background-image: url('${path.join(iconsDir, name)}.svg');
    background-repeat: no-repeat;
    width: ${relWidth}em;
    height: ${relHeight}em;

    @content;
  }
}
`;
}

function soy(name) {
  return `
  /**
   * @param baseUrl
   */
  {template .${slugName(name)}}
    {call .Base data="all"}
      {param name: '${name}' /}
      {param classModifier: '${camelCase(name)}' /}
    {/call}
  {/template}
`
}

let outputSoy = `{namespace common.CustomIcons}

/**
 * @param baseUrl
 * @param name
 * @param classModifier
 */
{template .Base}
  {call components.Svg.Icon data="all" }
    {param iconName: $name /}
    {param svgFileName: 'assets/generated/sprites.svg' /}
    {param additionalClasses}
      CustomIcon CustomIcon--{$classModifier}
    {/param}
  {/call}
{/template}
`;

let outputCSS = `@mixin CustomIcon-wrapper
{
  display: inline-flex;
  align-items: center;
}

@mixin CustomIcon--after
{
  justify-self: flex-end;
  margin-left: 1ex;
}

@mixin CustomIcon--before
{
  justify-self: flex-start;
  margin-right: 1ex;
}

.CustomIcon
{
  fill: currentColor;

  &-wrapper
  {
    @include CustomIcon-wrapper;
  }

  &-wrapper--end &
  {
    @include CustomIcon--after;
  }

  &-wrapper--start &
  {
    @include CustomIcon--before;
  }
}
`;

module.exports = function(grunt) {
  grunt.registerTask(
    'svg',
    'optimize & mash all the svgs into a sprite sheet for use with the icons component',
    function(){
      const done = this.async();
      const sprites = svgstore();

      if (!fs.existsSync(inputDirectory)) {
        mkdirp(inputDirectory)
          .then(() => {
            return done();
          })
          .catch(err => {
            grunt.fail.fatal(err);
          });
      } else {
        let files = fs.readdirSync(inputDirectory);

        if (!files.length) return done();

        Promise.all(ensureDirs.map((dir) => {
          return mkdirp(dir);
        }))
        .then(() => {
          return new Promise((resolve, reject) => {
            fs.emptyDir(iconsPath, (err) => {
              if(err) reject(err);
              else resolve();
            })
          })
        })
        .then(() => {
          return Promise.all(files.map(processSVG))
          .then((results) => {
            results.forEach((res) => {
              let file = res.filename;
              let spriteId = file.replace('.svg', '');
              sprites.add(spriteId, res.contents);
              outputCSS+=css(spriteId, res.info);
              outputSoy+=soy(spriteId);
              fs.writeFileSync(path.join(iconsPath, file), res.contents);
            });

            fs.writeFileSync(path.join(spritesPath, destFileName), sprites);
            fs.writeFileSync(cssOutputPath, outputCSS);
            fs.writeFileSync(soyOutputPath, outputSoy);
          });
        })
        .then(() => {return done()})
        .catch((err) => {
          grunt.fail.fatal(err);
          return done();
        });
      }
    }
  );
}
