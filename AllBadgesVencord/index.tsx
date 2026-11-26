import { addProfileBadge, BadgePosition, type ProfileBadge, removeProfileBadge } from "@api/Badges";
import { definePluginSettings, migratePluginSettings } from "@api/Settings";
import { LinkButton } from "@components/Button";
import { Card } from "@components/Card";
import { Link } from "@components/Link";
import { Paragraph } from "@components/Paragraph";
import definePlugin, { OptionType } from "@utils/types";
import { UserStore } from "@webpack/common";

import { badgeGroups } from "./catalog";

const pluginName = "AllBadgesVencord";
const github = "https://github.com/Adriano-leao-dev";
const repository = github + "/allbadges-vencord";
const authorAvatar = "data:image/jpeg;base64,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";
const catalog = badgeGroups.flatMap<readonly [string, string, string]>(group => group.badges);

migratePluginSettings(pluginName, "B4LordBadges");

const settings = definePluginSettings({
    showExtraBadges: {
        type: OptionType.BOOLEAN,
        description: "Mostrar as insígnias extras selecionadas",
        default: true,
    },
    ...Object.fromEntries(catalog.map(([id, description]) => [
        id,
        { type: OptionType.BOOLEAN as const, description, default: false, hidden: true },
    ])),
});

function About() {
    const selected = settings.use();
    return (
        <div style={{ display: "grid", gap: "12px" }}>
            <Card variant="normal">
                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                    <img width={40} height={40} style={{ borderRadius: "50%" }}
                        src={authorAvatar} alt="Foto de B4_Lord" />
                    <div>
                        <Paragraph weight="semibold">AllBadges Vencord</Paragraph>
                        <Link href={github}>B4_Lord no GitHub</Link>
                    </div>
                </div>
                <Paragraph style={{ marginTop: "12px" }}>
                    Abra uma categoria, marque as insígnias que quer mostrar e reabra seu perfil para conferir.
                    Sua seleção é salva e aparece localmente.
                </Paragraph>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                    <LinkButton href={repository + "/tree/main/AllBadgesVencord"}>Ver código-fonte</LinkButton>
                    <LinkButton href={repository + "#instalação"}>Como usar</LinkButton>
                </div>
            </Card>
            {badgeGroups.map(({ label, badges }) => (
                <details key={label}>
                    <summary style={{ cursor: "pointer", padding: "6px 0" }}>
                        {label} · {badges.filter(([id]) => selected[id]).length}/{badges.length}
                    </summary>
                    <div style={{ display: "grid", gap: "4px", padding: "4px 0 8px 16px" }}>
                        {badges.map(([id, description, iconSrc]) => (
                            <label key={id} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                <input type="checkbox" checked={selected[id] === true}
                                    onChange={event => { settings.store[id] = event.currentTarget.checked; }} />
                                <img loading="lazy" src={iconSrc} alt="" width={20} height={20} />
                                <span>{description}</span>
                            </label>
                        ))}
                    </div>
                </details>
            ))}
        </div>
    );
}

const provider: ProfileBadge = {
    id: "allbadges-vencord-provider",
    position: BadgePosition.START,
    shouldShow: ({ userId }) =>
        settings.store.showExtraBadges && userId === UserStore.getCurrentUser()?.id,
    getBadges: () => catalog
        .filter(([id]) => settings.store[id] === true)
        .map(([id, description, iconSrc]) => ({ id, description, iconSrc, name: description })),
};

export default definePlugin({
    name: pluginName,
    description: "Escolha as insígnias extras que aparecem no seu perfil do Discord, incluindo variantes e níveis.",
    authors: [{ name: "B4_Lord", id: 0n }],
    pluginModalLinks: {
        website: repository + "#readme",
        source: repository + "/tree/main/AllBadgesVencord",
    },
    pluginModalAuthorAvatars: { B4_Lord: authorAvatar },
    tags: ["Appearance"],
    dependencies: ["BadgeAPI"],
    settings,
    settingsAboutComponent: About,

    start() {
        addProfileBadge(provider);
    },

    stop() {
        removeProfileBadge(provider);
    },
});
