import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { colors } from '../../constants/theme';

export default function MarkdownMessage({ content }) {
  const { width } = useWindowDimensions();

  const markdownStyles = useMemo(
    () => ({
      body: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.78)',
        lineHeight: 22,
        fontFamily: 'ManropeLight',
      },
      heading1: {
        fontSize: 20,
        color: colors.white,
        fontFamily: 'ManropeBold',
        marginTop: 18,
        marginBottom: 8,
        lineHeight: 26,
      },
      heading2: {
        fontSize: 17,
        color: colors.white,
        fontFamily: 'ManropeSemiBold',
        marginTop: 15,
        marginBottom: 6,
        lineHeight: 23,
      },
      heading3: {
        fontSize: 15,
        color: colors.white,
        fontFamily: 'ManropeSemiBold',
        marginTop: 12,
        marginBottom: 4,
        lineHeight: 21,
      },
      heading4: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        fontFamily: 'ManropeSemiBold',
        marginTop: 10,
        marginBottom: 4,
        lineHeight: 20,
      },
      strong: {
        fontFamily: 'ManropeBold',
        color: 'rgba(255,255,255,0.92)',
      },
      em: {
        fontStyle: 'italic',
        color: 'rgba(255,255,255,0.82)',
      },
      s: {
        textDecorationLine: 'line-through',
        opacity: 0.6,
      },
      blockquote: {
        backgroundColor: 'rgba(163,177,138,0.08)',
        borderLeftWidth: 3,
        borderLeftColor: colors.sage,
        paddingLeft: 12,
        paddingVertical: 8,
        paddingRight: 8,
        marginVertical: 10,
        borderRadius: 4,
      },
      code_inline: {
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 4,
        paddingHorizontal: 5,
        paddingVertical: 2,
        fontFamily: 'monospace',
        fontSize: 12,
        color: colors.sage,
      },
      code_block: {
        backgroundColor: 'rgba(0,0,0,0.25)',
        borderRadius: 8,
        padding: 12,
        marginVertical: 10,
        fontFamily: 'monospace',
        fontSize: 12,
        color: 'rgba(255,255,255,0.82)',
        lineHeight: 18,
      },
      fence: {
        backgroundColor: 'rgba(0,0,0,0.25)',
        borderRadius: 8,
        padding: 12,
        marginVertical: 10,
      },
      link: {
        color: colors.gold,
        textDecorationLine: 'underline',
      },
      list_item: {
        marginVertical: 4,
        flexDirection: 'row',
      },
      ordered_list_icon: {
        color: colors.sage,
        fontFamily: 'ManropeSemiBold',
        fontSize: 13,
        lineHeight: 22,
        marginRight: 6,
      },
      bullet_list_icon: {
        color: colors.gold,
        fontSize: 8,
        lineHeight: 22,
        marginRight: 8,
        marginLeft: 2,
      },
      hr: {
        marginVertical: 14,
        backgroundColor: 'rgba(255,255,255,0.08)',
        height: 1,
      },
      table: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
        borderRadius: 8,
        marginVertical: 10,
        overflow: 'hidden',
      },
      thead: {
        backgroundColor: 'rgba(255,255,255,0.05)',
      },
      th: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.1)',
        fontFamily: 'ManropeSemiBold',
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
      },
      td: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 0.5,
        borderColor: 'rgba(255,255,255,0.08)',
        fontSize: 12,
        color: 'rgba(255,255,255,0.6)',
      },
      tr: {
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(255,255,255,0.06)',
      },
      paragraph: {
        marginTop: 0,
        marginBottom: 10,
      },
      image: {
        borderRadius: 8,
        maxWidth: width * 0.7,
      },
    }),
    [width]
  );

  if (!content) return null;

  return (
    <Markdown style={markdownStyles} mergeStyle={true}>
      {content}
    </Markdown>
  );
}
