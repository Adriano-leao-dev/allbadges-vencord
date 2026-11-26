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
